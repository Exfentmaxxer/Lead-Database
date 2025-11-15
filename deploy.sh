#!/bin/bash

# Lead Database - Automated Deployment Script
# This script helps you deploy to various platforms with minimal effort

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Lead Database - Deployment Assistant"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ Not in a git repository. Please run this from the project root."
    exit 1
fi

echo "Select your deployment method:"
echo ""
echo "1. Railway (Recommended - Free, Easy, Auto HTTPS)"
echo "2. Render (Alternative - Free, Auto HTTPS)"
echo "3. Docker (For VPS or local containers)"
echo "4. Local Development (Run on this computer)"
echo "5. Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🚂 Railway Deployment"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Check if Railway CLI is installed
        if ! command -v railway &> /dev/null; then
            echo "📦 Installing Railway CLI..."
            npm install -g @railway/cli
        fi

        echo "✅ Railway CLI ready"
        echo ""
        echo "Follow these steps:"
        echo "1. Login to Railway (browser will open)"
        echo "2. Create new project when prompted"
        echo "3. Wait for deployment to complete"
        echo ""
        read -p "Press Enter to start Railway login..."

        railway login

        echo ""
        echo "Initializing Railway project..."
        railway init

        echo ""
        echo "Deploying to Railway..."
        railway up

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Deployment Complete!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "To get your app URL:"
        echo "1. Run: railway open"
        echo "2. Or go to: https://railway.app/dashboard"
        echo "3. Click your project"
        echo "4. Copy the deployment URL"
        echo ""
        echo "Then open that URL on your iPhone in Safari!"
        echo ""
        ;;

    2)
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🎨 Render Deployment"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Render requires manual setup through their website."
        echo ""
        echo "Follow these steps:"
        echo ""
        echo "1. Go to: https://render.com"
        echo "2. Sign in with GitHub"
        echo "3. Click 'New +' → 'Web Service'"
        echo "4. Connect this repository"
        echo "5. Use these settings:"
        echo "   - Build Command: cd backend && npm install"
        echo "   - Start Command: cd backend && npm start"
        echo "6. Click 'Create Web Service'"
        echo "7. Wait 3-5 minutes for deployment"
        echo "8. Copy your .onrender.com URL"
        echo ""
        echo "Opening Render in your browser..."

        if command -v open &> /dev/null; then
            open "https://render.com/deploy?repo=$(git remote get-url origin)"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "https://render.com/deploy?repo=$(git remote get-url origin)"
        else
            echo ""
            echo "Please manually open: https://render.com"
        fi
        ;;

    3)
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "🐳 Docker Deployment"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker is not installed."
            echo "Please install Docker from: https://docs.docker.com/get-docker/"
            exit 1
        fi

        echo "Building Docker image..."
        docker build -t lead-database .

        echo ""
        echo "Starting container..."
        docker run -d \
            --name lead-database \
            -p 3000:3000 \
            --restart unless-stopped \
            lead-database

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Docker Container Running!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Access your app at: http://localhost:3000"
        echo ""
        echo "Useful commands:"
        echo "  View logs:    docker logs -f lead-database"
        echo "  Stop:         docker stop lead-database"
        echo "  Start:        docker start lead-database"
        echo "  Remove:       docker rm -f lead-database"
        echo ""
        ;;

    4)
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "💻 Local Development"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        # Check if Node.js is installed
        if ! command -v node &> /dev/null; then
            echo "❌ Node.js is not installed."
            echo "Please install Node.js 18+ from: https://nodejs.org"
            exit 1
        fi

        echo "Node.js version: $(node --version)"
        echo ""

        cd backend

        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies..."
            npm install
        else
            echo "Dependencies already installed."
        fi

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Ready to Start!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Start the server with:"
        echo "  cd backend && npm start"
        echo ""
        echo "Then open: http://localhost:3000"
        echo ""
        echo "For iPhone access on same WiFi:"
        echo "1. Find your IP: ifconfig | grep 'inet '"
        echo "2. On iPhone, open: http://YOUR_IP:3000"
        echo ""
        ;;

    5)
        echo ""
        echo "Goodbye! 👋"
        exit 0
        ;;

    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Next Step: Install on iPhone"
echo ""
echo "1. Open Safari on your iPhone"
echo "2. Go to your app URL"
echo "3. Tap Share → Add to Home Screen"
echo "4. Tap Add"
echo "5. Launch from home screen icon!"
echo ""
echo "📖 For detailed instructions, see: ONE_CLICK_DEPLOY.md"
echo ""
