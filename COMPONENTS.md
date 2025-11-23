# Component Documentation

This document explains the key components in the Cocopow app, designed to help you understand and extend the codebase for your BaaS tutorial.

## Theme & Styling

### Color Palette
- **Primary (Green)**: `#10B981` - Used for main actions, primary buttons
- **Secondary (Orange)**: `#F97316` - Used for accents, post button
- **Gradients**: Combined green-to-orange gradients for branding

### Design Principles
- **Mobile-First**: All components are designed for mobile, then enhanced for desktop
- **CSS Modules**: Scoped styling to prevent conflicts
- **Responsive**: Breakpoints at 640px (mobile), 768px (tablet), 1024px (desktop)

## Common Components

### Button (`src/components/common/Button.tsx`)
Reusable button component with multiple variants.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `isLoading`: boolean (shows spinner)

**Usage:**
\`\`\`tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
\`\`\`

### Input (`src/components/common/Input.tsx`)
Text input with label, error, and helper text support.

**Props:**
- `label`: Optional label text
- `error`: Error message to display
- `helperText`: Helper text below input

**Usage:**
\`\`\`tsx
<Input
  label="Email"
  placeholder="you@example.com"
  error={errors.email}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
\`\`\`

### TextArea (`src/components/common/TextArea.tsx`)
Multi-line text input with character counter.

**Props:**
- `showCount`: boolean - Show character counter
- `maxCount`: number - Maximum character count

**Usage:**
\`\`\`tsx
<TextArea
  placeholder="What's on your mind?"
  value={content}
  onChange={(e) => setContent(e.target.value)}
  showCount
  maxCount={5000}
/>
\`\`\`

### Avatar (`src/components/common/Avatar.tsx`)
User avatar with automatic initials fallback.

**Props:**
- `src`: Image URL (optional)
- `alt`: Alt text
- `username`: Used to generate initials if no image
- `size`: 'sm' | 'md' | 'lg' | 'xl'

**Usage:**
\`\`\`tsx
<Avatar
  src={user.avatarUrl}
  alt={user.displayName}
  username={user.displayName}
  size="md"
/>
\`\`\`

## Authentication Components

### LoginForm (`src/components/auth/LoginForm.tsx`)
Email/password login form with validation.

**Features:**
- Email validation
- Password requirement
- Error handling
- Loading state

### SignupForm (`src/components/auth/SignupForm.tsx`)
Registration form with comprehensive validation.

**Validation:**
- Username: 3-20 characters, alphanumeric + underscore
- Password: Min 8 chars, uppercase, lowercase, number
- Email: Valid email format
- Confirm password match

### GoogleLoginButton (`src/components/auth/GoogleLoginButton.tsx`)
Google OAuth integration using `@react-oauth/google`.

**Setup Required:**
- Google Client ID in `.env`
- Authorized origins configured in Google Cloud Console

## Post Components

### CreatePost (`src/components/post/CreatePost.tsx`)
Multi-type post creation component.

**Features:**
- Text, image, and video post types
- File upload with preview
- Hashtag and mention detection
- Real-time tag preview
- Character counter
- Validation

**Props:**
- `onSubmit`: (data: CreatePostData) => Promise<void>

**Usage:**
\`\`\`tsx
<CreatePost onSubmit={handleCreatePost} />
\`\`\`

### PostCard (`src/components/post/PostCard.tsx`)
Displays a single post with all interactions.

**Features:**
- User info with avatar
- Content with highlighted hashtags/mentions
- Media display (image/video)
- Like, comment, share buttons
- Relative timestamp
- Collapsible comment section

**Props:**
- `post`: Post object
- `onLike`: (postId: string) => void
- `onComment`: (postId: string, content: string) => void

### CommentSection (`src/components/post/CommentSection.tsx`)
Comment input and display area.

**Features:**
- Comment input with @ mention support
- Submit button
- Ready for comment list integration

## Feed Component

### Feed (`src/components/feed/Feed.tsx`)
Main feed/wall component combining post creation and display.

**Current Implementation:**
- Mock data for demonstration
- Post creation
- Post list display
- Like functionality
- Comment functionality

**BaaS Integration Points:**
Replace the mock implementation in:
- `handleCreatePost` - Call your BaaS API
- `mockPosts` - Fetch from your database
- `handleLike` - Update in database
- `handleComment` - Save to database

## Pages

### AuthPage (`src/pages/AuthPage.tsx`)
Authentication page with toggle between login/signup.

**Features:**
- Login/Signup toggle
- Google OAuth button
- Feature showcase
- Responsive layout

### HomePage (`src/pages/HomePage.tsx`)
Main app page after login.

**Features:**
- Sticky header with logo
- User info display
- Logout button
- Feed component

## Hooks

### useAuth (`src/hooks/useAuth.ts`)
Authentication context and hook.

**Provides:**
- `user`: Current user object or null
- `isLoading`: Loading state
- `login(credentials)`: Login function
- `signup(credentials)`: Signup function
- `loginWithGoogle(credential)`: Google OAuth
- `logout()`: Logout function

**Usage:**
\`\`\`tsx
const { user, login, logout } = useAuth();
\`\`\`

**BaaS Integration:**
Replace mock implementations with real API calls to your backend.

## Utilities

### Text Parser (`src/utils/textParser.ts`)
Functions for parsing and formatting text.

**Functions:**
- `extractHashtags(text)`: Returns array of hashtags
- `extractMentions(text)`: Returns array of mentions
- `formatRelativeTime(date)`: Returns "2h ago" format
- `formatNumber(num)`: Returns "1.2K" format

### Validation (`src/utils/validation.ts`)
Form validation functions.

**Functions:**
- `validateEmail(email)`: Boolean
- `validatePassword(password)`: { isValid, errors }
- `validateUsername(username)`: { isValid, error }
- `validatePostContent(content, type)`: { isValid, error }

## Types

### Key Types (`src/types/index.ts`)
\`\`\`typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
}

interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'text' | 'image' | 'video';
  content: string;
  mediaUrl?: string;
  hashtags: string[];
  mentions: string[];
  likes: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: Date;
}
\`\`\`

## Extending the App

### Adding a New Feature

1. **Create Component**
   - Add to appropriate folder in `src/components/`
   - Create `.tsx` and `.module.css` files
   - Export from `index.ts`

2. **Add Types**
   - Define interfaces in `src/types/index.ts`

3. **Add Utilities**
   - Helper functions in `src/utils/`

4. **Integrate**
   - Import and use in pages or other components

### Common Extensions

**User Profiles:**
- Create `Profile.tsx` page
- Add route in `App.tsx`
- Fetch user data in component

**Search:**
- Create `Search.tsx` component
- Add hashtag/user search functionality
- Integrate with BaaS search API

**Notifications:**
- Create notification component
- Add real-time listener
- Display in header

**Direct Messages:**
- Create chat components
- Add messaging route
- Implement real-time chat

## Best Practices

1. **Keep Components Small**: Each component should do one thing well
2. **Use TypeScript**: Define types for all props and data
3. **Mobile First**: Test on mobile viewport first
4. **Accessibility**: Use semantic HTML and ARIA labels
5. **Performance**: Lazy load images, virtualize long lists
6. **Error Handling**: Always handle loading and error states

## Testing Integration Points

Before connecting to BaaS, test:
- [ ] All forms validate correctly
- [ ] Buttons show loading states
- [ ] Errors display properly
- [ ] Routing works (protected/public routes)
- [ ] Mobile responsive at all breakpoints
- [ ] Hashtags and mentions are detected
- [ ] File uploads show previews

After BaaS integration:
- [ ] Authentication flows work
- [ ] Posts save to database
- [ ] Images/videos upload successfully
- [ ] Likes persist across refresh
- [ ] Comments save and load
- [ ] Real-time updates work
