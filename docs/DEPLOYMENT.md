# 🚀 Deployment Guide

Complete deployment instructions for various platforms.

## Table of Contents

1. [Development Deployment](#development-deployment)
2. [Production Deployment](#production-deployment)
3. [Platform-Specific Guides](#platform-specific-guides)
4. [iOS PWA Installation](#ios-pwa-installation)
5. [Troubleshooting](#troubleshooting)

---

## Development Deployment

### Local Development

**Step 1: Install Dependencies**
```bash
cd backend
npm install
```

**Step 2: Start Server**
```bash
npm start
```

**Step 3: Test Locally**
- Open browser: `http://localhost:3000`
- Test form submission
- Check records tab

**Step 4: Test on iPhone (Same Network)**
```bash
# Find your local IP
# Mac/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig
```

Access from iPhone Safari: `http://<YOUR_IP>:3000`

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Test all functionality locally
- [ ] Run test suite: `npm test`
- [ ] Set environment variables
- [ ] Configure CORS for your domain
- [ ] Prepare SSL certificate (HTTPS required for PWA)
- [ ] Create app icons (192x192 and 512x512)
- [ ] Set up database backup strategy

---

## Platform-Specific Guides

### 🚂 Railway (Recommended)

**Why Railway?**
- Zero-config deployment
- Free tier available
- Automatic HTTPS
- Built-in database backups
- Easy environment variables

**Steps:**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Install Railway CLI** (optional)
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy via GitHub**
   - Push code to GitHub
   - In Railway dashboard, click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway auto-detects Node.js

4. **Configure Build**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `/`

5. **Set Environment Variables** (optional)
   ```
   PORT=3000
   NODE_ENV=production
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the provided URL

7. **Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as shown

**Cost:** Free tier includes 500 hours/month (enough for small apps)

---

### 🎨 Render

**Why Render?**
- Simple deployment
- Free tier with auto-sleep
- Managed PostgreSQL (if needed later)
- Automatic HTTPS

**Steps:**

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Dashboard → "New +" → "Web Service"
   - Connect your repository

3. **Configure Service**
   ```
   Name: lead-database
   Region: Choose closest to users
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   - Click "Environment"
   - Add: `NODE_ENV=production`

5. **Choose Plan**
   - Free tier auto-sleeps after 15 min inactivity
   - Starter: $7/month for always-on

6. **Deploy**
   - Click "Create Web Service"
   - Wait for build
   - Access via provided URL

**Note:** Free tier spins down with inactivity. First request after idle may take 30 seconds.

---

### 🌊 DigitalOcean App Platform

**Why DigitalOcean?**
- Reliable infrastructure
- Easy scaling
- Good documentation
- $5/month starter plan

**Steps:**

1. **Create Account**
   - Go to https://digitalocean.com
   - Sign up and add payment method

2. **Create App**
   - Apps → "Create App"
   - Choose "GitHub"
   - Authorize and select repository

3. **Configure Resources**
   ```
   Resource Type: Web Service
   Branch: main
   Source Directory: backend
   Build Command: npm install
   Run Command: npm start
   HTTP Port: 3000
   ```

4. **Choose Plan**
   - Basic: $5/month
   - Includes 512MB RAM, enough for this app

5. **Environment Variables**
   ```
   NODE_ENV=production
   ```

6. **Deploy**
   - Review and create
   - Wait for deployment
   - Test the URL

**Cost:** $5/month minimum

---

### 🖥️ VPS Deployment (Ubuntu 22.04)

**Why VPS?**
- Full control
- Better performance for high traffic
- Can run multiple apps
- Best for advanced users

**Providers:**
- DigitalOcean Droplet: $4-6/month
- Linode: $5/month
- Vultr: $2.50-6/month
- AWS Lightsail: $3.50-5/month

**Steps:**

1. **Create VPS**
   - Choose Ubuntu 22.04 LTS
   - Minimum: 1GB RAM
   - Enable SSH keys

2. **Initial Server Setup**
   ```bash
   # SSH into server
   ssh root@your-server-ip

   # Update system
   apt update && apt upgrade -y

   # Create non-root user
   adduser deploy
   usermod -aG sudo deploy
   su - deploy
   ```

3. **Install Node.js**
   ```bash
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

4. **Install Git**
   ```bash
   sudo apt-get install -y git
   ```

5. **Clone Repository**
   ```bash
   cd ~
   git clone https://github.com/your-username/Lead-Database.git
   cd Lead-Database/backend
   ```

6. **Install Dependencies**
   ```bash
   npm install
   ```

7. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

8. **Start Application**
   ```bash
   pm2 start server.js --name lead-database
   pm2 save
   pm2 startup
   # Run the command it outputs
   ```

9. **Install Nginx (Reverse Proxy)**
   ```bash
   sudo apt-get install -y nginx
   ```

10. **Configure Nginx**
    ```bash
    sudo nano /etc/nginx/sites-available/lead-database
    ```

    Add:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

    Enable site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/lead-database /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. **Install SSL Certificate (Let's Encrypt)**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

12. **Set Up Firewall**
    ```bash
    sudo ufw allow 'Nginx Full'
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

13. **Set Up Automated Backups**
    ```bash
    # Create backup script
    nano ~/backup-database.sh
    ```

    Add:
    ```bash
    #!/bin/bash
    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_DIR=~/backups
    mkdir -p $BACKUP_DIR
    cp ~/Lead-Database/backend/leads.db $BACKUP_DIR/leads_$DATE.db
    # Keep only last 30 backups
    ls -t $BACKUP_DIR/leads_*.db | tail -n +31 | xargs rm -f
    ```

    Make executable and schedule:
    ```bash
    chmod +x ~/backup-database.sh
    crontab -e
    ```

    Add (runs daily at 2 AM):
    ```
    0 2 * * * /home/deploy/backup-database.sh
    ```

**VPS Management Commands:**
```bash
# View logs
pm2 logs lead-database

# Restart app
pm2 restart lead-database

# Monitor resources
pm2 monit

# Update app
cd ~/Lead-Database
git pull
cd backend
npm install
pm2 restart lead-database
```

---

## iOS PWA Installation

### Installing on iPhone/iPad

1. **Open in Safari**
   - Navigate to your deployed URL
   - Ensure you're using Safari (not Chrome)

2. **Add to Home Screen**
   - Tap the Share button (square with arrow)
   - Scroll down to "Add to Home Screen"
   - Edit name if desired
   - Tap "Add"

3. **Launch**
   - Find the icon on your home screen
   - Tap to launch in standalone mode

### Verifying PWA Installation

✅ **Correctly Installed:**
- No Safari UI visible (no address bar)
- App opens in full screen
- Status bar matches app theme
- Works offline

❌ **Not Properly Installed:**
- Safari address bar visible
- Can't find on home screen
- Opens in Safari when tapped
- Doesn't work offline

### Common iOS PWA Issues

**Issue: "Add to Home Screen" not appearing**
- Solution: Must use Safari browser
- Solution: Ensure HTTPS is used (required)
- Solution: Check manifest.json is accessible

**Issue: App opens in Safari instead of standalone**
- Solution: Delete and reinstall
- Solution: Verify `display: "standalone"` in manifest.json
- Solution: Clear Safari cache

**Issue: Icons not showing**
- Solution: Ensure icon files exist and are accessible
- Solution: Icons must be PNG format
- Solution: Check icon paths in manifest.json

**Issue: Offline mode not working**
- Solution: HTTPS is required for service workers
- Solution: Check service worker registration in console
- Solution: Clear site data and reinstall

---

## Troubleshooting

### Server Won't Start

**Error: `EADDRINUSE` (Port already in use)**
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
# Or use different port
PORT=3001 npm start
```

**Error: `MODULE_NOT_FOUND`**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error: `SQLITE_CANTOPEN`**
```bash
# Check permissions
chmod 755 backend
chmod 644 backend/leads.db  # If exists
# Or create directory
mkdir -p backend
```

### Database Issues

**Database corrupted:**
```bash
# Check integrity
sqlite3 backend/leads.db "PRAGMA integrity_check;"

# Restore from backup
cp backend/leads.backup.db backend/leads.db

# If no backup, recreate (data loss!)
rm backend/leads.db
# Restart server to recreate schema
```

**Can't write to database:**
```bash
# Check permissions
ls -l backend/leads.db

# Fix permissions
chmod 644 backend/leads.db
chmod 755 backend
```

### Network Issues

**Can't access from iPhone on same network:**

1. **Check firewall:**
   ```bash
   # Mac - allow Node.js
   # Go to System Preferences → Security & Privacy → Firewall

   # Linux - allow port
   sudo ufw allow 3000
   ```

2. **Verify server is listening on all interfaces:**
   - Server should bind to `0.0.0.0`, not `localhost`
   - Check server.js:
   ```javascript
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

3. **Check same network:**
   ```bash
   # On server
   ifconfig | grep "inet "

   # On iPhone Settings → Wi-Fi → (i) button
   # Ensure same subnet (e.g., both 192.168.1.x)
   ```

**CORS errors:**
```javascript
// In server.js, configure CORS
const cors = require('cors');
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:3000']
}));
```

### Performance Issues

**Slow response times:**
1. Check database size
   ```bash
   ls -lh backend/leads.db
   ```

2. Optimize database (if large)
   ```bash
   sqlite3 backend/leads.db "VACUUM;"
   ```

3. Add more indexes (already optimized)

4. Increase server resources
   - VPS: Upgrade RAM/CPU
   - Railway/Render: Upgrade plan

**High memory usage:**
```bash
# Check with PM2
pm2 monit

# Restart to clear memory
pm2 restart lead-database
```

---

## Monitoring & Logging

### Application Logs

**With PM2:**
```bash
# View all logs
pm2 logs

# View specific app
pm2 logs lead-database

# View only errors
pm2 logs lead-database --err

# Clear logs
pm2 flush
```

**With systemd (alternative to PM2):**
```bash
journalctl -u lead-database -f
```

### Uptime Monitoring

**Free Services:**
- UptimeRobot: https://uptimerobot.com
- StatusCake: https://www.statuscake.com
- Uptime.com (limited free tier)

**Setup:**
1. Create account
2. Add HTTP(S) monitor
3. Enter your app URL
4. Set check interval (5 minutes recommended)
5. Add notification email

---

## Scaling

### When to Scale

Monitor these metrics:
- Response time > 1 second
- CPU usage > 80%
- Memory usage > 80%
- Error rate > 1%

### Horizontal Scaling

**Load Balancer + Multiple Instances:**
1. Deploy multiple app instances
2. Set up Nginx load balancer
3. Share database between instances
4. Use Redis for session sharing (if adding auth later)

**Example Nginx config:**
```nginx
upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### Vertical Scaling

Simply upgrade server resources:
- Railway: Upgrade plan
- VPS: Resize droplet/instance
- DigitalOcean App: Change plan tier

---

## Security Best Practices

1. **Use HTTPS Always**
   - Required for PWA
   - Free with Let's Encrypt
   - Railway/Render provide automatically

2. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

3. **Set Secure Headers**
   ```javascript
   // In server.js
   app.use((req, res, next) => {
     res.setHeader('X-Content-Type-Options', 'nosniff');
     res.setHeader('X-Frame-Options', 'DENY');
     res.setHeader('X-XSS-Protection', '1; mode=block');
     next();
   });
   ```

4. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

   ```javascript
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

5. **Environment Variables**
   - Never commit `.env` files
   - Use platform's environment variable system
   - Rotate secrets regularly

6. **Regular Backups**
   - Automated daily backups
   - Store off-server (S3, Dropbox, etc.)
   - Test restoration process

---

## Next Steps After Deployment

- [ ] Test all features in production
- [ ] Install PWA on iPhone
- [ ] Test offline functionality
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Add to home screen on all devices
- [ ] Train users
- [ ] Document any custom modifications

---

**Need Help?**

Common deployment issues and solutions are in the main README troubleshooting section.

For platform-specific issues, consult:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- DigitalOcean: https://docs.digitalocean.com
