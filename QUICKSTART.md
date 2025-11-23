# 🚀 Quick Start Guide

Get Cocopow running in 3 minutes!

## Prerequisites Check

```bash
# Check if Node.js is installed
node --version  # Should be v18 or higher
npm --version   # Should be v9 or higher
```

Don't have Node.js? Download from [nodejs.org](https://nodejs.org/)

## Installation

```bash
# Install dependencies
npm install
```

## Run the App

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## What You'll See

1. **Auth Page** - Login/Signup forms
   - Try creating an account (mock data, won't persist)
   - Or just enter any email/password to "login"

2. **Home Page** - After login
   - See sample posts from mock users
   - Create new posts (text/image/video)
   - Try hashtags: `#react #typescript`
   - Try mentions: `@username`
   - Like posts
   - Add comments

## Features to Test

### Post Types
```
Text: Just write anything
Image: Click image icon → select a photo
Video: Click video icon → select a video
```

### Hashtags & Mentions
```
Use #hashtag for topics
Use @username to mention users
They'll be highlighted automatically!
```

### Mobile View
```
Resize browser to mobile width (375px)
Everything is mobile-optimized!
```

## Optional: Google OAuth Setup

Skip this if you just want to test the app. For Google login:

1. Copy environment file:
```bash
cp .env.example .env
```

2. Get Google Client ID:
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Create project → Enable Google+ API → Create OAuth credentials
   - Add `http://localhost:5173` to authorized origins

3. Add to `.env`:
```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
```

4. Restart dev server

## Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## File Structure at a Glance

```
src/
├── components/     # UI components
│   ├── auth/      # Login, signup
│   ├── common/    # Buttons, inputs
│   ├── feed/      # Main feed
│   └── post/      # Post components
├── pages/         # AuthPage, HomePage
├── hooks/         # useAuth
├── utils/         # Helpers
└── styles/        # Theme, global CSS
```

## Common Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
```

## Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 5173 in use"
Vite will automatically use next available port (5174, 5175, etc.)

### Google OAuth not working
Make sure `.env` file exists and has valid VITE_GOOGLE_CLIENT_ID

### Styles not loading
Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

## Next: BaaS Integration

See [README.md](README.md) for full documentation on integrating with your backend!

Ready to connect to:
- Firebase
- Supabase
- Appwrite
- Or any other BaaS

---

**Made with ❤️ for learning BaaS development**

Questions? Check [COMPONENTS.md](COMPONENTS.md) for detailed component docs.
