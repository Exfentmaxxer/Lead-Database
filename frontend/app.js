// ========================================
// Lead Database PWA - Main Application
// ========================================

'use strict';

// ========================================
// Configuration
// ========================================

const CONFIG = {
  API_BASE_URL: window.location.origin,
  ENDPOINTS: {
    SUBMIT: '/api/submit',
    RECORDS: '/api/records',
    RECORD: '/api/record',
    HEALTH: '/api/health'
  },
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  STORAGE_KEY: 'pending_submissions'
};

// ========================================
// State Management
// ========================================

const AppState = {
  isOnline: navigator.onLine,
  pendingSubmissions: [],
  currentRecords: [],
  deferredPrompt: null
};

// ========================================
// DOM Elements
// ========================================

const DOM = {
  // Form elements
  leadForm: document.getElementById('leadForm'),
  submitBtn: document.getElementById('submitBtn'),
  submitBtnText: document.getElementById('submitBtnText'),
  submitBtnLoader: document.getElementById('submitBtnLoader'),
  resetBtn: document.getElementById('resetBtn'),

  // Alert
  alert: document.getElementById('alert'),
  alertMessage: document.getElementById('alertMessage'),
  alertClose: document.getElementById('alertClose'),

  // Connection status
  connectionStatus: document.getElementById('connectionStatus'),
  statusIndicator: document.getElementById('statusIndicator'),
  statusText: document.getElementById('statusText'),

  // Tabs
  formTab: document.getElementById('formTab'),
  recordsTab: document.getElementById('recordsTab'),
  formContent: document.getElementById('formContent'),
  recordsContent: document.getElementById('recordsContent'),

  // Records
  recordsList: document.getElementById('recordsList'),
  searchInput: document.getElementById('searchInput'),
  recordModal: document.getElementById('recordModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.getElementById('modalClose'),

  // Install prompt
  installPrompt: document.getElementById('installPrompt'),
  installBtn: document.getElementById('installBtn'),
  dismissInstall: document.getElementById('dismissInstall')
};

// ========================================
// Utility Functions
// ========================================

const Utils = {
  // Show alert message
  showAlert(message, type = 'success') {
    DOM.alertMessage.textContent = message;
    DOM.alert.className = `alert ${type}`;
    DOM.alert.style.display = 'flex';

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideAlert();
    }, 5000);
  },

  // Hide alert message
  hideAlert() {
    DOM.alert.style.display = 'none';
  },

  // Update connection status
  updateConnectionStatus(isOnline) {
    AppState.isOnline = isOnline;

    if (isOnline) {
      DOM.statusIndicator.className = 'status-indicator online';
      DOM.statusText.textContent = 'Online';
    } else {
      DOM.statusIndicator.className = 'status-indicator offline';
      DOM.statusText.textContent = 'Offline';
    }
  },

  // Validate email format
  validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate phone format
  validatePhone(phone) {
    const regex = /^[\d\s\-\+\(\)\.]+$/;
    return regex.test(phone);
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// ========================================
// API Functions
// ========================================

const API = {
  // Make API request with retry logic
  async request(endpoint, options = {}, retries = CONFIG.RETRY_ATTEMPTS) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if (retries > 0 && !error.message.includes('Validation')) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
        return this.request(endpoint, options, retries - 1);
      }
      throw error;
    }
  },

  // Submit lead data
  async submitLead(data) {
    return this.request(CONFIG.ENDPOINTS.SUBMIT, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Get all records
  async getRecords() {
    return this.request(CONFIG.ENDPOINTS.RECORDS);
  },

  // Get single record
  async getRecord(id) {
    return this.request(`${CONFIG.ENDPOINTS.RECORD}/${id}`);
  },

  // Check API health
  async checkHealth() {
    try {
      await this.request(CONFIG.ENDPOINTS.HEALTH);
      return true;
    } catch {
      return false;
    }
  }
};

// ========================================
// Offline Storage
// ========================================

const Storage = {
  // Save pending submission
  savePendingSubmission(data) {
    const pending = this.getPendingSubmissions();
    pending.push({
      data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(pending));
    AppState.pendingSubmissions = pending;
  },

  // Get pending submissions
  getPendingSubmissions() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // Clear pending submissions
  clearPendingSubmissions() {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    AppState.pendingSubmissions = [];
  },

  // Sync pending submissions
  async syncPendingSubmissions() {
    const pending = this.getPendingSubmissions();

    if (pending.length === 0) return;

    console.log(`📤 Syncing ${pending.length} pending submission(s)...`);

    let successCount = 0;
    const failed = [];

    for (const item of pending) {
      try {
        await API.submitLead(item.data);
        successCount++;
      } catch (error) {
        console.error('Failed to sync submission:', error);
        failed.push(item);
      }
    }

    // Update storage with failed submissions
    if (failed.length > 0) {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(failed));
      AppState.pendingSubmissions = failed;
    } else {
      this.clearPendingSubmissions();
    }

    if (successCount > 0) {
      Utils.showAlert(`✅ Synced ${successCount} pending submission(s)`, 'success');
    }
  }
};

// ========================================
// Form Handling
// ========================================

const FormHandler = {
  // Initialize form
  init() {
    DOM.leadForm.addEventListener('submit', this.handleSubmit.bind(this));
    DOM.resetBtn.addEventListener('click', this.handleReset.bind(this));

    // Add input event listeners for validation
    const inputs = DOM.leadForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  },

  // Validate individual field
  validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let error = '';

    // Required field validation
    if (field.required && !value) {
      error = 'This field is required';
    }

    // Email validation
    if (name === 'email' && value && !Utils.validateEmail(value)) {
      error = 'Please enter a valid email address';
    }

    // Phone validation
    if (name === 'phone' && value && !Utils.validatePhone(value)) {
      error = 'Please enter a valid phone number';
    }

    this.showFieldError(field, error);
    return !error;
  },

  // Show field error
  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}Error`);

    if (message) {
      field.classList.add('error');
      if (errorElement) {
        errorElement.textContent = message;
      }
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.textContent = '';
      }
    }
  },

  // Clear field error
  clearFieldError(field) {
    this.showFieldError(field, '');
  },

  // Validate entire form
  validateForm() {
    const inputs = DOM.leadForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    // Also validate optional email and phone fields
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');

    if (emailField.value && !this.validateField(emailField)) {
      isValid = false;
    }

    if (phoneField.value && !this.validateField(phoneField)) {
      isValid = false;
    }

    return isValid;
  },

  // Get form data
  getFormData() {
    const formData = new FormData(DOM.leadForm);
    const data = {};

    for (let [key, value] of formData.entries()) {
      // Handle checkbox
      if (key === 'follow_up_required') {
        data[key] = document.getElementById('followUpRequired').checked;
      } else {
        data[key] = value.trim();
      }
    }

    return data;
  },

  // Handle form submission
  async handleSubmit(event) {
    event.preventDefault();

    // Validate form
    if (!this.validateForm()) {
      Utils.showAlert('⚠️ Please fix the errors in the form', 'error');
      return;
    }

    // Disable submit button
    DOM.submitBtn.disabled = true;
    DOM.submitBtnText.style.display = 'none';
    DOM.submitBtnLoader.style.display = 'inline';

    try {
      const data = this.getFormData();

      if (AppState.isOnline) {
        // Try to submit online
        await API.submitLead(data);
        Utils.showAlert('✅ Lead saved successfully!', 'success');
        this.handleReset();
      } else {
        // Save for offline sync
        Storage.savePendingSubmission(data);
        Utils.showAlert('💾 Saved offline. Will sync when online.', 'warning');
        this.handleReset();
      }
    } catch (error) {
      console.error('Submission error:', error);

      if (error.message.includes('Validation')) {
        Utils.showAlert(`❌ ${error.message}`, 'error');
      } else {
        // Save for offline sync on network error
        const data = this.getFormData();
        Storage.savePendingSubmission(data);
        Utils.showAlert('💾 Network error. Saved offline for sync.', 'warning');
        this.handleReset();
      }
    } finally {
      // Re-enable submit button
      DOM.submitBtn.disabled = false;
      DOM.submitBtnText.style.display = 'inline';
      DOM.submitBtnLoader.style.display = 'none';
    }
  },

  // Handle form reset
  handleReset() {
    DOM.leadForm.reset();

    // Clear all error states
    const inputs = DOM.leadForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      this.clearFieldError(input);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// ========================================
// Records Management
// ========================================

const RecordsManager = {
  // Load records
  async loadRecords() {
    DOM.recordsList.innerHTML = '<div class="loading">Loading records...</div>';

    try {
      const response = await API.getRecords();
      AppState.currentRecords = response.data || [];
      this.renderRecords(AppState.currentRecords);
    } catch (error) {
      console.error('Error loading records:', error);
      DOM.recordsList.innerHTML = `
        <div class="no-records">
          <p>❌ Failed to load records</p>
          <p style="font-size: 14px; margin-top: 8px;">
            ${AppState.isOnline ? 'Server error' : 'You are offline'}
          </p>
        </div>
      `;
    }
  },

  // Render records
  renderRecords(records) {
    if (records.length === 0) {
      DOM.recordsList.innerHTML = `
        <div class="no-records">
          <p>📭 No records found</p>
        </div>
      `;
      return;
    }

    DOM.recordsList.innerHTML = records.map(record => `
      <div class="record-card" data-id="${record.id}">
        <h3>${this.escapeHtml(record.business_name)}</h3>
        <p>📍 ${this.escapeHtml(record.address)}</p>
        ${record.contact_name ? `<p>👤 ${this.escapeHtml(record.contact_name)}</p>` : ''}
        ${record.phone ? `<p>📞 ${this.escapeHtml(record.phone)}</p>` : ''}
        <p style="font-size: 13px; color: #6c757d; margin-top: 8px;">
          🕒 ${Utils.formatDate(record.created_at)}
        </p>
        ${record.follow_up_required ? '<span class="record-badge follow-up">⚠️ Follow-up Required</span>' : ''}
      </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.record-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.showRecordDetail(id);
      });
    });
  },

  // Show record detail
  async showRecordDetail(id) {
    try {
      const response = await API.getRecord(id);
      const record = response.data;

      DOM.modalTitle.textContent = record.business_name;
      DOM.modalBody.innerHTML = `
        <div class="detail-row">
          <div class="detail-label">Business Name</div>
          <div class="detail-value">${this.escapeHtml(record.business_name)}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Address</div>
          <div class="detail-value">${this.escapeHtml(record.address)}</div>
        </div>
        ${record.contact_name ? `
          <div class="detail-row">
            <div class="detail-label">Contact Name</div>
            <div class="detail-value">${this.escapeHtml(record.contact_name)}</div>
          </div>
        ` : ''}
        ${record.phone ? `
          <div class="detail-row">
            <div class="detail-label">Phone</div>
            <div class="detail-value"><a href="tel:${this.escapeHtml(record.phone)}">${this.escapeHtml(record.phone)}</a></div>
          </div>
        ` : ''}
        ${record.email ? `
          <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value"><a href="mailto:${this.escapeHtml(record.email)}">${this.escapeHtml(record.email)}</a></div>
          </div>
        ` : ''}
        ${record.hood_type ? `
          <div class="detail-row">
            <div class="detail-label">Hood Type</div>
            <div class="detail-value">${this.escapeHtml(record.hood_type)}</div>
          </div>
        ` : ''}
        ${record.service_frequency ? `
          <div class="detail-row">
            <div class="detail-label">Service Frequency</div>
            <div class="detail-value">${this.escapeHtml(record.service_frequency)}</div>
          </div>
        ` : ''}
        ${record.nfpa_deficiencies ? `
          <div class="detail-row">
            <div class="detail-label">NFPA-96 Deficiencies</div>
            <div class="detail-value">${this.escapeHtml(record.nfpa_deficiencies)}</div>
          </div>
        ` : ''}
        ${record.pricing_notes ? `
          <div class="detail-row">
            <div class="detail-label">Pricing Notes</div>
            <div class="detail-value">${this.escapeHtml(record.pricing_notes)}</div>
          </div>
        ` : ''}
        ${record.general_notes ? `
          <div class="detail-row">
            <div class="detail-label">General Notes</div>
            <div class="detail-value">${this.escapeHtml(record.general_notes)}</div>
          </div>
        ` : ''}
        <div class="detail-row">
          <div class="detail-label">Follow-up Required</div>
          <div class="detail-value">${record.follow_up_required ? '✅ Yes' : '❌ No'}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Created</div>
          <div class="detail-value">${Utils.formatDate(record.created_at)}</div>
        </div>
      `;

      DOM.recordModal.style.display = 'flex';
    } catch (error) {
      console.error('Error loading record:', error);
      Utils.showAlert('❌ Failed to load record details', 'error');
    }
  },

  // Search records
  searchRecords(query) {
    if (!query.trim()) {
      this.renderRecords(AppState.currentRecords);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = AppState.currentRecords.filter(record => {
      return (
        record.business_name.toLowerCase().includes(lowerQuery) ||
        record.address.toLowerCase().includes(lowerQuery) ||
        (record.contact_name && record.contact_name.toLowerCase().includes(lowerQuery))
      );
    });

    this.renderRecords(filtered);
  },

  // Escape HTML
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// ========================================
// Tab Management
// ========================================

const TabManager = {
  init() {
    DOM.formTab.addEventListener('click', () => this.switchTab('form'));
    DOM.recordsTab.addEventListener('click', () => this.switchTab('records'));
  },

  switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    if (tab === 'form') {
      DOM.formTab.classList.add('active');
      DOM.formContent.classList.add('active');
    } else if (tab === 'records') {
      DOM.recordsTab.classList.add('active');
      DOM.recordsContent.classList.add('active');
      RecordsManager.loadRecords();
    }
  }
};

// ========================================
// PWA Installation
// ========================================

const PWAInstaller = {
  init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      AppState.deferredPrompt = e;
      this.showInstallPrompt();
    });

    // Install button click
    DOM.installBtn?.addEventListener('click', async () => {
      if (AppState.deferredPrompt) {
        AppState.deferredPrompt.prompt();
        const { outcome } = await AppState.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
          console.log('✅ PWA installed');
        }

        AppState.deferredPrompt = null;
        this.hideInstallPrompt();
      }
    });

    // Dismiss button click
    DOM.dismissInstall?.addEventListener('click', () => {
      this.hideInstallPrompt();
    });
  },

  showInstallPrompt() {
    if (DOM.installPrompt) {
      DOM.installPrompt.style.display = 'block';
    }
  },

  hideInstallPrompt() {
    if (DOM.installPrompt) {
      DOM.installPrompt.style.display = 'none';
    }
  }
};

// ========================================
// Event Listeners
// ========================================

const EventListeners = {
  init() {
    // Online/Offline events
    window.addEventListener('online', () => {
      Utils.updateConnectionStatus(true);
      Storage.syncPendingSubmissions();
    });

    window.addEventListener('offline', () => {
      Utils.updateConnectionStatus(false);
    });

    // Alert close button
    DOM.alertClose?.addEventListener('click', () => {
      Utils.hideAlert();
    });

    // Modal close
    DOM.modalClose?.addEventListener('click', () => {
      DOM.recordModal.style.display = 'none';
    });

    // Modal backdrop click
    DOM.recordModal?.addEventListener('click', (e) => {
      if (e.target === DOM.recordModal) {
        DOM.recordModal.style.display = 'none';
      }
    });

    // Search input
    DOM.searchInput?.addEventListener(
      'input',
      Utils.debounce((e) => {
        RecordsManager.searchRecords(e.target.value);
      }, 300)
    );
  }
};

// ========================================
// Service Worker Registration
// ========================================

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found');
      });
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }
}

// ========================================
// App Initialization
// ========================================

async function init() {
  console.log('🚀 Initializing Lead Database PWA...');

  // Update connection status
  Utils.updateConnectionStatus(navigator.onLine);

  // Initialize components
  FormHandler.init();
  TabManager.init();
  EventListeners.init();
  PWAInstaller.init();

  // Register service worker
  await registerServiceWorker();

  // Load pending submissions
  AppState.pendingSubmissions = Storage.getPendingSubmissions();

  // Sync pending submissions if online
  if (AppState.isOnline) {
    await Storage.syncPendingSubmissions();
  }

  console.log('✅ App initialized successfully');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
