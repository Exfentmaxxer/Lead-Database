# 📋 Lead Database - NFPA-96 Inspection PWA

**iOS-optimized Progressive Web App for field data collection. Deploy in 5 minutes, use anywhere.**

---

## 🚀 ONE-CLICK DEPLOY TO YOUR iPHONE

### Step 1: Deploy to Cloud (2 minutes)

Choose one platform and click the button:

**Railway (Recommended - Always Free)**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

- ✅ 500 hours/month FREE
- ✅ Auto HTTPS
- ✅ No credit card
- ✅ Always on

**Render (Alternative - Free with Sleep)**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

- ✅ FREE unlimited hours
- ⚠️ Sleeps after 15min (30s wake)
- ✅ Auto HTTPS

### Step 2: Install on iPhone (1 minute)

1. **Open Safari** on your iPhone
2. Go to your deployed URL (e.g., `https://your-app.up.railway.app`)
3. Tap **Share** → **Add to Home Screen**
4. Tap **Add**

### Step 3: Use It!

**Tap the icon on your home screen. App launches instantly like a native app!**

---

## ✨ What This Does

A complete lead/inspection database for NFPA-96 field work:

- ✅ **Collect Data** - Business info, contact details, NFPA-96 deficiencies, pricing
- ✅ **Works Offline** - Submit forms without internet, auto-syncs later
- ✅ **Search Records** - Find and view all submitted leads
- ✅ **iOS Optimized** - Touch-friendly, safe area support, native feel
- ✅ **Instant Launch** - One tap from home screen, opens in <1 second
- ✅ **Secure** - HTTPS, input validation, SQL injection prevention

---

## 🎯 Perfect For

- Field technicians collecting inspection data
- Sales teams gathering lead information
- Service companies tracking customer sites
- Anyone needing offline-capable data collection on iPhone

---

## 📊 Data Fields Included

### Required
- Business Name
- Address

### Optional
- Contact Name
- Phone
- Email
- Hood Type (dropdown)
- NFPA-96 Deficiencies (multiline)
- Service Frequency (dropdown)
- Pricing Notes
- Follow-Up Required (checkbox)
- General Notes
- Auto-generated Timestamp

---

## 💻 Alternative: Run Locally

If you prefer to run on your computer instead of the cloud:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/Lead-Database.git
cd Lead-Database

# Install dependencies
cd backend
npm install

# Start server
npm start
```

Access at `http://localhost:3000`

**For iPhone access on same WiFi:**
1. Find your computer's IP: `ifconfig | grep "inet "`
2. On iPhone Safari: `http://YOUR_IP:3000`

---

## 🛠️ Deployment Methods

### Method 1: One-Click (Easiest)

Click the deploy buttons at the top of this page. No configuration needed.

### Method 2: Automated Script

```bash
./deploy.sh
```

Interactive script that guides you through deployment to Railway, Render, or Docker.

### Method 3: Manual Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Method 4: Docker

```bash
docker build -t lead-database .
docker run -d -p 3000:3000 --name lead-database lead-database
```

---

## 📱 iOS PWA Installation Details

### What Happens When You Add to Home Screen

1. **Icon appears** on iPhone home screen
2. **Launches standalone** - No Safari UI, full screen
3. **Loads instantly** - Cached for offline use
4. **Works offline** - Form submissions saved locally
5. **Auto-syncs** - Data uploads when connection restored

### Requirements

- ✅ iOS 11.3+ (iPhone 13 fully supported)
- ✅ Safari browser (Chrome won't work for PWA installation)
- ✅ HTTPS URL (auto-provided by Railway/Render)

### Offline Capabilities

**What works offline:**
- Opening the app
- Filling out forms
- Submitting data (saved locally)
- Viewing previously loaded records

**Auto-syncs when online:**
- Pending submissions upload automatically
- Connection status indicator shows online/offline
- Success messages confirm sync

---

## 🔧 Customization

### Replace Icons (Recommended)

Current icons are placeholders. For production:

1. Create branded icons (192x192 and 512x512 PNG)
2. Replace:
   - `frontend/icon-192.png`
   - `frontend/icon-512.png`
3. Commit and push (Railway/Render auto-updates)

### Change Colors

Edit `frontend/styles.css`:

```css
:root {
  --color-primary: #0066cc;     /* Your brand color */
  --bg-primary: #1a1a2e;        /* Header background */
  --bg-secondary: #16213e;      /* Gradient background */
}
```

### Add/Remove Form Fields

1. Edit `frontend/index.html` (add/remove form fields)
2. Update `backend/database.js` (modify schema)
3. Update `backend/server.js` (add validation if needed)

### Custom Domain

After deploying:

1. Go to Railway/Render dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `leads.yourdomain.com`)
4. Update DNS records as shown
5. Wait for DNS propagation (5-60 minutes)

---

## 🧪 Testing

### Automated Tests

```bash
cd backend
npm test
```

Runs tests for all API endpoints, validation, and error handling.

### Manual Testing Checklist

**Form Submission:**
- [ ] Fill out required fields (Business Name, Address)
- [ ] Submit form
- [ ] Verify success message
- [ ] Check data in Records tab

**Offline Mode:**
- [ ] Turn on Airplane Mode
- [ ] Fill and submit form
- [ ] Verify "Saved offline" message
- [ ] Turn off Airplane Mode
- [ ] Verify data syncs automatically

**PWA Installation:**
- [ ] Add to home screen works
- [ ] Icon appears on home screen
- [ ] Launches without Safari UI
- [ ] All features work in standalone mode

---

## 📖 Documentation

### Quick Start
- **[ONE_CLICK_DEPLOY.md](ONE_CLICK_DEPLOY.md)** - Complete deployment guide with troubleshooting
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute local setup guide

### Detailed Guides
- **[README_DETAILED.md](README_DETAILED.md)** - Original comprehensive README
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Advanced deployment (VPS, custom setups)
- **[docs/SYSTEM_VERIFICATION.md](docs/SYSTEM_VERIFICATION.md)** - Complete testing checklist

---

## 🏗️ Architecture

### Backend
- **Node.js** + **Express** - RESTful API server
- **SQLite** - Embedded database (no external DB needed)
- **better-sqlite3** - Fast, synchronous SQLite bindings

### Frontend
- **Vanilla JavaScript** - No framework bloat, fast loading
- **Progressive Web App** - Service worker for offline support
- **iOS-optimized CSS** - Safe areas, touch targets, native feel

### Deployment
- **Railway** / **Render** - Cloud platforms with free tiers
- **Docker** - Containerized for easy self-hosting
- **One-click** - Automated deployment configurations

---

## 🔒 Security

### Implemented
- ✅ **Input validation** (client + server)
- ✅ **SQL injection prevention** (prepared statements)
- ✅ **XSS prevention** (output escaping)
- ✅ **HTTPS** (via Railway/Render)
- ✅ **CORS** configuration
- ✅ **Error handling** (no sensitive data leaks)

### Production Recommendations
- Use environment variables for sensitive config
- Set up regular database backups
- Implement rate limiting for API endpoints
- Add authentication for multi-user scenarios
- Monitor logs for suspicious activity

---

## 💰 Cost

### Free Tier (Recommended for Personal Use)

**Railway:**
- 500 hours/month free
- ~20 days of continuous operation
- Perfect for personal/small team use
- Exceeding limit: $5/month usage-based

**Render:**
- Unlimited hours free
- Auto-sleeps after 15min inactivity
- 30-second wake-up on first request
- Perfect for occasional use

### Paid Tiers (For Production)

**Railway Pro:**
- $5/month minimum
- Usage-based pricing
- Always-on
- Better performance

**Render Starter:**
- $7/month
- Always-on (no sleep)
- Dedicated resources

---

## 🐛 Troubleshooting

### Deployment Issues

**"Build Failed"**
- Check Railway/Render logs
- Verify all files committed to GitHub
- Try redeploying (click "Redeploy")

**"Can't access URL"**
- Wait 5 minutes after deployment
- Check deployment status (should say "Live" or "Active")
- Try incognito/private browsing

### iPhone Issues

**"Add to Home Screen" not showing**
- Must use Safari browser
- Must be HTTPS (Railway/Render auto-provide)
- Try hard refresh (pull down on page)

**App opens in Safari instead of standalone**
- Delete from home screen
- Clear Safari cache (Settings → Safari → Clear History)
- Re-add to home screen

**Not working offline**
- Needs first successful online load
- Verify service worker installed (Safari → Develop → Service Workers)
- Try reinstalling PWA

### Database Issues

**"Error saving data"**
- Check deployment logs
- Verify SQLite initialized correctly
- Check disk space (Railway/Render free tiers)

**"Lost data after restart"**
- Free tiers may not persist database between deploys
- For production, set up persistent storage
- Consider Railway's volume mounting

---

## 🤝 Contributing

This is a complete, working system. If you want to add features:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Potential enhancements:**
- User authentication (multi-user support)
- Photo uploads for inspections
- PDF report generation
- Email notifications
- GPS location capture
- Data export to Excel
- Admin dashboard

---

## 📄 License

MIT License - Free to use for personal or commercial projects.

---

## 🎉 Get Started Now

### Deploy in 3 Steps:

1. **Click deploy button** (at top of page)
2. **Wait 2-3 minutes** for deployment
3. **Open URL on iPhone** → Add to home screen

**That's it!** Start collecting leads immediately.

---

## 📞 Support

**Quick Questions:** See [ONE_CLICK_DEPLOY.md](ONE_CLICK_DEPLOY.md) troubleshooting section

**Technical Details:** See [README_DETAILED.md](README_DETAILED.md)

**Advanced Deployment:** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

**Built for field professionals. Optimized for iPhone 13 and iOS. Ready in 5 minutes.** 🚀

---

## 📸 Screenshots

*Add screenshots of your deployed app here for better visualization*

---

## ⭐ Features Highlights

- 📱 **Native-like iOS experience** - Standalone mode, safe areas, haptics-ready
- 🔌 **Offline-first architecture** - Works without internet, syncs automatically
- ⚡ **Instant deployment** - One click to production-ready app
- 🎨 **Customizable** - Easy theme changes, custom icons, your branding
- 🔒 **Secure** - HTTPS, validation, SQL injection prevention
- 💾 **Persistent storage** - SQLite database with automatic timestamps
- 🔍 **Search & filter** - Find leads quickly with real-time search
- 📊 **Clean interface** - Minimal, professional, thumb-friendly

---

**No coding required. No server management. Just deploy and use.** ✨
