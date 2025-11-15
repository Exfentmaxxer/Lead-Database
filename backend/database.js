const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, 'leads.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create leads table with comprehensive schema
const initSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      address TEXT NOT NULL,
      contact_name TEXT,
      phone TEXT,
      email TEXT,
      hood_type TEXT,
      nfpa_deficiencies TEXT,
      service_frequency TEXT,
      pricing_notes TEXT,
      follow_up_required INTEGER DEFAULT 0,
      general_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_business_name ON leads(business_name);
    CREATE INDEX IF NOT EXISTS idx_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_follow_up ON leads(follow_up_required);
  `);

  console.log('✓ Database schema initialized');
};

// Initialize schema on module load
initSchema();

// Prepared statements for better performance
const statements = {
  insertLead: db.prepare(`
    INSERT INTO leads (
      business_name, address, contact_name, phone, email,
      hood_type, nfpa_deficiencies, service_frequency,
      pricing_notes, follow_up_required, general_notes
    ) VALUES (
      @business_name, @address, @contact_name, @phone, @email,
      @hood_type, @nfpa_deficiencies, @service_frequency,
      @pricing_notes, @follow_up_required, @general_notes
    )
  `),

  getAllLeads: db.prepare(`
    SELECT * FROM leads ORDER BY created_at DESC
  `),

  getLeadById: db.prepare(`
    SELECT * FROM leads WHERE id = ?
  `),

  updateLead: db.prepare(`
    UPDATE leads SET
      business_name = @business_name,
      address = @address,
      contact_name = @contact_name,
      phone = @phone,
      email = @email,
      hood_type = @hood_type,
      nfpa_deficiencies = @nfpa_deficiencies,
      service_frequency = @service_frequency,
      pricing_notes = @pricing_notes,
      follow_up_required = @follow_up_required,
      general_notes = @general_notes,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `),

  deleteLead: db.prepare(`
    DELETE FROM leads WHERE id = ?
  `),

  searchLeads: db.prepare(`
    SELECT * FROM leads
    WHERE business_name LIKE ?
       OR address LIKE ?
       OR contact_name LIKE ?
    ORDER BY created_at DESC
  `)
};

// Database operations
const database = {
  // Create a new lead
  createLead(data) {
    try {
      const info = statements.insertLead.run({
        business_name: data.business_name || '',
        address: data.address || '',
        contact_name: data.contact_name || null,
        phone: data.phone || null,
        email: data.email || null,
        hood_type: data.hood_type || null,
        nfpa_deficiencies: data.nfpa_deficiencies || null,
        service_frequency: data.service_frequency || null,
        pricing_notes: data.pricing_notes || null,
        follow_up_required: data.follow_up_required ? 1 : 0,
        general_notes: data.general_notes || null
      });

      return { id: info.lastInsertRowid, changes: info.changes };
    } catch (error) {
      console.error('Database error (createLead):', error);
      throw error;
    }
  },

  // Get all leads
  getAllLeads() {
    try {
      const leads = statements.getAllLeads.all();
      // Convert follow_up_required to boolean
      return leads.map(lead => ({
        ...lead,
        follow_up_required: lead.follow_up_required === 1
      }));
    } catch (error) {
      console.error('Database error (getAllLeads):', error);
      throw error;
    }
  },

  // Get lead by ID
  getLeadById(id) {
    try {
      const lead = statements.getLeadById.get(id);
      if (lead) {
        lead.follow_up_required = lead.follow_up_required === 1;
      }
      return lead;
    } catch (error) {
      console.error('Database error (getLeadById):', error);
      throw error;
    }
  },

  // Update a lead
  updateLead(id, data) {
    try {
      const info = statements.updateLead.run({
        id,
        business_name: data.business_name || '',
        address: data.address || '',
        contact_name: data.contact_name || null,
        phone: data.phone || null,
        email: data.email || null,
        hood_type: data.hood_type || null,
        nfpa_deficiencies: data.nfpa_deficiencies || null,
        service_frequency: data.service_frequency || null,
        pricing_notes: data.pricing_notes || null,
        follow_up_required: data.follow_up_required ? 1 : 0,
        general_notes: data.general_notes || null
      });

      return { changes: info.changes };
    } catch (error) {
      console.error('Database error (updateLead):', error);
      throw error;
    }
  },

  // Delete a lead
  deleteLead(id) {
    try {
      const info = statements.deleteLead.run(id);
      return { changes: info.changes };
    } catch (error) {
      console.error('Database error (deleteLead):', error);
      throw error;
    }
  },

  // Search leads
  searchLeads(query) {
    try {
      const searchPattern = `%${query}%`;
      const leads = statements.searchLeads.all(searchPattern, searchPattern, searchPattern);
      return leads.map(lead => ({
        ...lead,
        follow_up_required: lead.follow_up_required === 1
      }));
    } catch (error) {
      console.error('Database error (searchLeads):', error);
      throw error;
    }
  },

  // Close database connection
  close() {
    db.close();
  }
};

module.exports = database;
