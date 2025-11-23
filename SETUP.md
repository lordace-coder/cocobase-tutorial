# Cocopow Setup Guide

## Quick Start

### 1. Install Node.js

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/) (v18 or higher recommended).

Verify installation:
\`\`\`bash
node --version
npm --version
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables (Optional)

For Google OAuth to work:

\`\`\`bash
cp .env.example .env
\`\`\`

Then edit `.env` and add your Google Client ID. If you skip this step, the app will still work but Google login won't function.

To get a Google Client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add `http://localhost:5173` to authorized JavaScript origins
6. Copy the Client ID to your `.env` file

### 4. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will open at [http://localhost:5173](http://localhost:5173)

### 5. Build for Production

\`\`\`bash
npm run build
\`\`\`

### 6. Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Features Overview

### Current Features (Mock Data)
- ✅ Login/Signup pages with validation
- ✅ Google OAuth integration (needs configuration)
- ✅ Create posts (text, image, video)
- ✅ View feed with mock posts
- ✅ Like posts
- ✅ Comment on posts
- ✅ Hashtag detection (#hashtag)
- ✅ User mention detection (@username)
- ✅ Mobile-first responsive design
- ✅ Green & Orange theme

### Ready for BaaS Integration
All components are built with mock data that can be easily replaced with real API calls. The structure is designed to make backend integration straightforward.

Key files to update for BaaS integration:
- `src/hooks/useAuth.ts` - Replace mock login/signup with real API
- `src/components/feed/Feed.tsx` - Replace mock posts with real data
- Add your BaaS SDK to `package.json`

## Troubleshooting

### Port already in use
If port 5173 is busy, Vite will automatically use the next available port.

### Google OAuth not working
Make sure you:
1. Created a `.env` file
2. Added your Google Client ID
3. Added `http://localhost:5173` to authorized origins in Google Cloud Console

### Build errors
Try deleting `node_modules` and reinstalling:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Project Structure

\`\`\`
cocobase-tutorial/
├── src/
│   ├── components/
│   │   ├── auth/           # Login, Signup, Google OAuth
│   │   ├── common/         # Button, Input, TextArea, Avatar
│   │   ├── feed/           # Main feed component
│   │   └── post/           # Post creation, display, comments
│   ├── hooks/              # useAuth hook
│   ├── pages/              # AuthPage, HomePage
│   ├── styles/             # Global styles & theme
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md               # Documentation
\`\`\`

## Next Steps for BaaS Tutorial

1. Choose your BaaS provider (Firebase, Supabase, Appwrite, etc.)
2. Set up authentication
3. Create database schema for users, posts, comments
4. Set up file storage for images/videos
5. Replace mock data with real API calls
6. Add real-time updates
7. Deploy to production

Happy coding! 🥥⚡
