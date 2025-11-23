# 🚀 Getting Started with Cocopow

Welcome! This guide will help you get Cocopow running on your machine.

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Node.js

Download and install Node.js v18 or higher from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show v9.x.x or higher
```

### 2️⃣ Install Dependencies

```bash
npm install
```

This will install all required packages (~200MB download).

### 3️⃣ Start Development Server

```bash
npm run dev
```

Open your browser to **http://localhost:5173** 🎉

---

## 📖 What You'll See

### Login Page
- Try signing up with any email/password (mock data)
- Or just click "Sign in" with any credentials
- Google OAuth button (needs setup - see below)

### Home Page (After Login)
- **Create Post**: Choose text, image, or video
- **Try hashtags**: Type `#react #typescript` in your post
- **Try mentions**: Type `@username` in your post  
- **Like posts**: Click the heart icon
- **Comment**: Click the comment icon
- **Sample posts**: See mock posts from demo users

---

## 🎨 Features to Explore

### Post Creation
```
📝 Text Posts: Write anything
🖼️ Image Posts: Click image tab → upload photo
🎥 Video Posts: Click video tab → upload video
```

### Social Features
```
#️⃣ Hashtags: Type #topic - auto-highlighted in green
@ Mentions: Type @user - auto-highlighted in orange
❤️ Likes: Click heart to like/unlike
💬 Comments: Click comment to add thoughts
```

### Mobile Testing
```
Resize browser to 375px width
All components are mobile-optimized!
```

---

## 🔧 Optional: Google OAuth Setup

Skip this if you just want to test the app locally.

### Get Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Create **OAuth 2.0 Client ID**:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
5. Copy the Client ID

### Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your Client ID
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
```

### Restart Server

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

Now the Google login button will work! 🎊

---

## 📚 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## 🏗️ Project Structure (Quick Overview)

```
src/
├── components/
│   ├── auth/       # Login, Signup, Google OAuth
│   ├── common/     # Buttons, Inputs, Avatar
│   ├── feed/       # Main feed/wall
│   └── post/       # Post creation & display
├── pages/          # AuthPage, HomePage
├── hooks/          # useAuth (authentication)
├── utils/          # Helpers (validation, parsing)
├── styles/         # Theme & global CSS
└── types/          # TypeScript types
```

---

## 🎯 Next Steps

### Just Exploring?
- Play with the app
- Try creating posts with hashtags and mentions
- Check out the code structure
- Read [COMPONENTS.md](COMPONENTS.md) for component details

### Building a Tutorial?
- Check [README.md](README.md) for full documentation
- See integration points in [COMPONENTS.md](COMPONENTS.md)
- All mock data is clearly marked for easy replacement

### Integrating with BaaS?
Key files to update:
- `src/hooks/useAuth.tsx` - Authentication
- `src/components/feed/Feed.tsx` - Posts & comments
- Add your BaaS SDK to `package.json`

---

## ❓ Troubleshooting

### Server won't start?
```bash
# Make sure Node.js is installed
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 in use?
Vite will automatically use the next port (5174, 5175, etc.)

### Google OAuth not working?
- Check `.env` file exists
- Verify Client ID is correct
- Restart dev server after changing `.env`
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help

### More issues?
Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions.

---

## 📖 Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** ← You are here
- **[QUICKSTART.md](QUICKSTART.md)** - Ultra-quick 3-minute guide
- **[README.md](README.md)** - Full documentation
- **[COMPONENTS.md](COMPONENTS.md)** - Component documentation
- **[SETUP.md](SETUP.md)** - Detailed setup guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Problem solutions
- **[PROJECT_STRUCTURE.txt](PROJECT_STRUCTURE.txt)** - File structure

---

## 🎨 Theme Colors

```
Primary:    #10B981 (Emerald Green)
Secondary:  #F97316 (Vibrant Orange)

Gradients combine both for that fresh green-orange vibe! 🥥⚡
```

---

## ✨ What Makes This Special?

- ✅ **Production-ready** code structure
- ✅ **TypeScript** for type safety
- ✅ **Mobile-first** responsive design
- ✅ **Well-organized** for tutorials
- ✅ **Easy BaaS integration** - mock data clearly separated
- ✅ **Modern stack** - React 18, Vite, CSS Modules
- ✅ **Beautiful UI** - Green & orange theme

---

## 🤝 Contributing

This is a tutorial project! Feel free to:
- Fork and modify
- Use for learning
- Integrate with your favorite BaaS
- Build something amazing!

---

## 📝 License

MIT - Use however you want!

---

**Happy coding!** 🥥⚡

Need help? Check the docs above or look through the well-commented code.
