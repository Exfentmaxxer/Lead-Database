# 📋 Lead Database - NFPA-96 Inspection PWA

A fully functional Progressive Web App (PWA) optimized for iOS Safari, designed for field data collection of NFPA-96 lead and inspection information.

## ✨ Features

- **iOS Optimized**: Built specifically for iOS Safari with native-like experience
- **Offline Capability**: Works without internet connection, syncs when online
- **PWA Install**: Add to home screen for quick access
- **Touch Friendly**: Large touch targets optimized for thumb navigation
- **Real-time Validation**: Instant input validation with clear error messages
- **Data Persistence**: SQLite database with automatic backups
- **Responsive Design**: Works on all screen sizes
- **Fast & Lightweight**: No build step, instant deployment

## 📱 System Requirements

### Backend
- Node.js 18.0 or higher
- npm or yarn

### Client (iOS)
- iOS 11.3 or higher
- Safari browser
- Modern Android browsers also supported

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on port 3000. You'll see:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Lead Database Server Running
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Port: 3000
🌐 Local: http://localhost:3000
📱 Network: http://<your-ip>:3000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Access from iPhone

#### Option A: Local Network (Same WiFi)
1. Find your computer's IP address:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet "

   # On Windows
   ipconfig
   ```
2. On your iPhone, open Safari and go to: `http://<YOUR_IP>:3000`

#### Option B: Using ngrok (For Remote Access)
1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Use the provided HTTPS URL on your iPhone

### 4. Install as PWA on iPhone

1. Open the app in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right
5. The app icon will appear on your home screen

**Done! 🎉**

## 📂 Project Structure

```
Lead-Database/
├── backend/
│   ├── package.json          # Node.js dependencies
│   ├── server.js             # Express server
│   ├── database.js           # SQLite database operations
│   └── leads.db              # SQLite database (auto-created)
│
├── frontend/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # iOS-optimized CSS
│   ├── app.js                # Application logic
│   ├── service-worker.js     # Offline caching
│   ├── manifest.json         # PWA manifest
│   └── icon-*.png            # App icons (you'll add these)
│
└── README.md                 # This file
```

## 🗄️ Database Schema

The SQLite database includes the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | INTEGER | Auto | Primary key |
| business_name | TEXT | Yes | Business name |
| address | TEXT | Yes | Full address |
| contact_name | TEXT | No | Contact person |
| phone | TEXT | No | Phone number |
| email | TEXT | No | Email address |
| hood_type | TEXT | No | Type of hood system |
| nfpa_deficiencies | TEXT | No | NFPA-96 deficiencies found |
| service_frequency | TEXT | No | Recommended service frequency |
| pricing_notes | TEXT | No | Pricing information |
| follow_up_required | INTEGER | No | Boolean flag for follow-up |
| general_notes | TEXT | No | Additional notes |
| created_at | DATETIME | Auto | Creation timestamp |
| updated_at | DATETIME | Auto | Last update timestamp |

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

### Create Lead
```http
POST /api/submit
Content-Type: application/json

{
  "business_name": "ABC Restaurant",
  "address": "123 Main St, City, State 12345",
  "contact_name": "John Doe",
  "phone": "(555) 123-4567",
  "email": "john@example.com",
  "hood_type": "Type I - Grease",
  "nfpa_deficiencies": "Filter maintenance required",
  "service_frequency": "Quarterly",
  "pricing_notes": "$500/quarter",
  "follow_up_required": true,
  "general_notes": "Needs follow-up call"
}
```

### Get All Records
```http
GET /api/records
```

### Get Single Record
```http
GET /api/record/:id
```

### Update Record
```http
PUT /api/record/:id
Content-Type: application/json
```

### Delete Record
```http
DELETE /api/record/:id
```

### Search Records
```http
GET /api/search?q=restaurant
```

## 🌐 Deployment Options

### Option 1: Local Server (Development)
```bash
cd backend
npm start
```
Access at `http://localhost:3000`

### Option 2: Railway (Recommended for Production)

1. Create account at https://railway.app
2. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```
3. Deploy:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```
4. Set environment variables in Railway dashboard if needed

### Option 3: Render

1. Create account at https://render.com
2. Connect your GitHub repository
3. Create new Web Service
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Deploy

### Option 4: DigitalOcean App Platform

1. Create account at https://digitalocean.com
2. Create new App
3. Connect repository
4. Configure build:
   - Build command: `cd backend && npm install`
   - Run command: `cd backend && npm start`
5. Deploy

### Option 5: VPS (Ubuntu/Debian)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo-url>
cd Lead-Database/backend

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start server
pm2 start server.js --name lead-database

# Make it start on boot
pm2 startup
pm2 save

# Setup nginx reverse proxy (optional)
sudo apt-get install nginx
# Configure nginx to proxy to localhost:3000
```

## 🧪 Testing the Application

### Manual Testing Checklist

#### Form Submission
- [ ] Fill out required fields (Business Name, Address)
- [ ] Submit form and verify success message
- [ ] Check that form clears after submission
- [ ] Verify data appears in Records tab

#### Validation
- [ ] Try submitting empty required fields
- [ ] Enter invalid email format
- [ ] Enter invalid phone format
- [ ] Verify error messages appear correctly

#### Offline Functionality
- [ ] Turn on Airplane Mode on iPhone
- [ ] Fill out and submit form
- [ ] Verify "Saved offline" message appears
- [ ] Turn off Airplane Mode
- [ ] Verify data syncs automatically

#### Records View
- [ ] Switch to Records tab
- [ ] Verify all submitted records appear
- [ ] Tap a record to view details
- [ ] Test search functionality

#### PWA Installation
- [ ] Install app to home screen
- [ ] Launch from home screen
- [ ] Verify app opens in standalone mode (no Safari UI)
- [ ] Test all functionality from installed app

### Automated Testing Script

Create `backend/test.js`:

```javascript
const http = require('http');

const tests = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET'
  },
  {
    name: 'Create Lead',
    path: '/api/submit',
    method: 'POST',
    data: {
      business_name: 'Test Restaurant',
      address: '123 Test St'
    }
  },
  {
    name: 'Get Records',
    path: '/api/records',
    method: 'GET'
  }
];

async function runTests() {
  console.log('🧪 Running tests...\n');

  for (const test of tests) {
    try {
      await runTest(test);
      console.log(`✅ ${test.name} - PASSED`);
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED: ${error.message}`);
    }
  }
}

function runTest(test) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);

    if (test.data) {
      req.write(JSON.stringify(test.data));
    }

    req.end();
  });
}

runTests();
```

Run tests:
```bash
node test.js
```

## 🎨 Customization

### Change App Colors

Edit `frontend/styles.css`:
```css
:root {
  --color-primary: #0066cc;        /* Main brand color */
  --bg-primary: #1a1a2e;           /* Header background */
  --bg-secondary: #16213e;         /* Gradient background */
}
```

### Add Your Logo

Replace the emoji in `frontend/index.html`:
```html
<h1>📋 Lead Database</h1>
<!-- Change to: -->
<h1><img src="/logo.png" alt="Logo"> Lead Database</h1>
```

### Modify Form Fields

Edit `frontend/index.html` to add/remove fields, then update:
1. Database schema in `backend/database.js`
2. Validation in `backend/server.js`
3. Form handler in `frontend/app.js`

## 🖼️ Adding App Icons

The PWA requires icons for installation. Generate them using any of these methods:

### Method 1: Online Generator
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a logo (at least 512x512px)
3. Download the generated icons
4. Place in `frontend/` folder

### Method 2: Using ImageMagick
```bash
# Install ImageMagick
brew install imagemagick  # Mac
sudo apt-get install imagemagick  # Linux

# Generate icons from source image
convert logo.png -resize 192x192 frontend/icon-192.png
convert logo.png -resize 512x512 frontend/icon-512.png
```

### Method 3: Manual Creation
Create two PNG files:
- `frontend/icon-192.png` (192x192 pixels)
- `frontend/icon-512.png` (512x512 pixels)

## 🔒 Security Considerations

### Input Validation
- All inputs are validated on both client and server
- SQL injection prevented via prepared statements
- XSS prevented via proper output escaping

### Production Recommendations
1. **Use HTTPS**: Required for PWA features
2. **Set CORS properly**: Restrict to your domain
3. **Add rate limiting**: Prevent abuse
4. **Regular backups**: Backup `backend/leads.db` regularly
5. **Environment variables**: Use for sensitive config

Example production `.env`:
```bash
PORT=3000
NODE_ENV=production
DATABASE_PATH=/var/lib/lead-database/leads.db
CORS_ORIGIN=https://yourdomain.com
```

## 📊 Monitoring & Maintenance

### View Database Records
```bash
# Install sqlite3 CLI
brew install sqlite3  # Mac
sudo apt-get install sqlite3  # Linux

# Open database
sqlite3 backend/leads.db

# List all records
SELECT * FROM leads;

# Export to CSV
.mode csv
.output leads.csv
SELECT * FROM leads;
.quit
```

### Backup Database
```bash
# Create backup
cp backend/leads.db backend/leads.backup.db

# Or use SQLite backup
sqlite3 backend/leads.db ".backup backend/leads.backup.db"
```

### Server Logs
```bash
# If using PM2
pm2 logs lead-database

# View errors
pm2 logs lead-database --err

# Monitor in real-time
pm2 monit
```

## 🐛 Troubleshooting

### App won't install on iOS
- Ensure you're using HTTPS (required for PWA)
- Check that all icon files exist
- Verify `manifest.json` is valid JSON
- Clear Safari cache and try again

### Offline mode not working
- Check service worker registration in browser console
- Ensure HTTPS is used (service workers require it)
- Verify `service-worker.js` is accessible

### Database errors
- Check file permissions on `leads.db`
- Ensure SQLite is properly installed
- Check disk space

### Form validation issues
- Open browser console for detailed errors
- Check network tab for API response
- Verify required fields have values

### Can't access from iPhone
- Ensure iPhone and server are on same WiFi
- Check firewall settings
- Verify server is listening on 0.0.0.0, not just localhost

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🙋 Support

For issues or questions:
1. Check this README thoroughly
2. Review browser console for errors
3. Check server logs for backend issues
4. Verify network connectivity

## 🎯 Roadmap

Future enhancements:
- [ ] User authentication
- [ ] Multi-user support
- [ ] PDF report generation
- [ ] Photo uploads
- [ ] GPS location capture
- [ ] Email notifications
- [ ] Data export to Excel
- [ ] Cloud backup integration

---

**Built with ❤️ for field technicians**
