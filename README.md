# Cocopow 🥥⚡

A modern community app built with React, TypeScript, and Vite - designed for BaaS (Backend as a Service) tutorial.

## Features

- 🔐 **Authentication**: Email/password login and Google OAuth
- 📝 **Posts**: Create text, image, and video posts
- 💬 **Comments**: Engage with posts through comments
- 🏷️ **Hashtags**: Organize and discover content with hashtags
- 👤 **Mentions**: Tag users with @ mentions
- ❤️ **Likes**: Show appreciation for posts
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- 🎨 **Green & Orange Theme**: Eye-catching color scheme

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling
- **Google OAuth** - Third-party authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Create environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

3. Configure your Google OAuth Client ID in `.env`:

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one
- Enable Google+ API
- Create OAuth 2.0 credentials
- Add your client ID to `.env`

4. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

\`\`\`
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── common/        # Reusable UI components
│   ├── feed/          # Feed/wall components
│   └── post/          # Post-related components
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── styles/            # Global styles and theme
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── App.tsx            # Main app component
└── main.tsx           # App entry point
\`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist/` directory.

## Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Integrating with BaaS

This app is designed to be easily integrated with any Backend as a Service. To connect your BaaS:

1. Update the API functions in `src/hooks/useAuth.ts`
2. Replace mock data in `src/components/feed/Feed.tsx`
3. Add your BaaS SDK/client
4. Configure environment variables for your BaaS endpoint

### TODO for BaaS Integration:

- [ ] Connect authentication to real backend
- [ ] Implement post CRUD operations
- [ ] Add comment functionality
- [ ] Set up file upload for images/videos
- [ ] Add real-time updates for likes and comments
- [ ] Implement user profiles
- [ ] Add hashtag and mention search

## Design

- **Primary Color**: Emerald Green (#10B981)
- **Secondary Color**: Orange (#F97316)
- **Mobile-First**: Optimized for mobile devices with responsive breakpoints
- **Modern UI**: Clean, minimalist design with smooth animations

## License

MIT

## Contributing

This is a tutorial project. Feel free to fork and modify for your own learning!
