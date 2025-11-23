# State Management Implementation Guide

This project now uses **Zustand** for efficient state management, preventing unnecessary data reloads when navigating between pages.

## Installation

First, install the Zustand package:

```bash
npm install zustand
# or
yarn add zustand
# or
pnpm add zustand
```

## Architecture Overview

### Stores

We have two main stores:

1. **Posts Store** (`src/store/postsStore.ts`) - Manages all post-related data
2. **Auth Store** (`src/store/authStore.ts`) - Manages authentication state (optional, currently using Context API)

### How It Works

#### Posts Store Features:

- **Automatic Caching**: Posts are cached for 5 minutes by default
- **Smart Fetching**: Only fetches new data if cache is stale or forced refresh
- **Optimistic Updates**: UI updates immediately for likes/comments
- **Memory Efficient**: Single source of truth for all post data

#### Cache Strategy:

```
User visits Feed → Store checks cache → If fresh (< 5 min) → Use cached data
                                      → If stale → Fetch new data

User navigates away and returns → Store uses cached data (instant load)

User clicks refresh → Force fetch new data → Update cache
```

## Usage Examples

### In Feed Component

```tsx
import { usePostsStore } from '@/store';

export const Feed = () => {
  const {
    posts,           // Array of posts
    isLoading,       // Loading state
    error,           // Error state
    fetchPosts,      // Fetch function
    toggleLike,      // Like/unlike post
    addPost,         // Add new post to store
  } = usePostsStore();

  useEffect(() => {
    fetchPosts(); // Will use cache if available
  }, [fetchPosts]);

  // Force refresh
  const handleRefresh = () => {
    fetchPosts(true); // true = bypass cache
  };
};
```

### In Post Detail Page

```tsx
import { usePostsStore } from '@/store';

export const PostDetailPage = () => {
  const { getPostById, toggleLike } = usePostsStore();

  // Priority loading strategy:
  // 1. Check navigation state (instant)
  // 2. Check Zustand store cache (instant)
  // 3. Fetch from database (slow)

  const cachedPost = getPostById(postId);
  if (cachedPost) {
    // Use cached data - no loading spinner!
  }
};
```

## Store API Reference

### Posts Store

#### State
- `posts: Post[]` - Array of all posts
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `lastFetched: number | null` - Timestamp of last fetch

#### Actions
- `fetchPosts(forceRefresh?: boolean)` - Fetch posts from database
- `addPost(post: Post)` - Add new post to store
- `updatePost(postId: string, updates: Partial<Post>)` - Update existing post
- `deletePost(postId: string)` - Remove post from store
- `getPostById(postId: string)` - Get single post by ID
- `toggleLike(postId: string)` - Toggle like status
- `incrementCommentCount(postId: string)` - Increment comment count
- `clearPosts()` - Clear all posts (logout/cleanup)

## Configuration

### Cache Duration

Edit the cache duration in `src/store/postsStore.ts`:

```typescript
// Default: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Change to 10 minutes
const CACHE_DURATION = 10 * 60 * 1000;

// Change to 30 seconds (testing)
const CACHE_DURATION = 30 * 1000;
```

### Persistence

To persist posts across browser sessions, add persistence middleware:

```typescript
import { persist } from 'zustand/middleware';

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      // ... your store
    }),
    {
      name: 'posts-storage',
      partialize: (state) => ({
        posts: state.posts,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
```

## Benefits

✅ **No Redundant Fetches** - Data fetched once, reused everywhere
✅ **Instant Navigation** - Cached data loads immediately
✅ **Reduced Server Load** - Fewer API calls
✅ **Better UX** - No loading spinners when data is cached
✅ **Memory Efficient** - Single source of truth
✅ **Type Safe** - Full TypeScript support
✅ **Developer Friendly** - Simple, clean API

## Migration Checklist

- [x] Install Zustand
- [x] Create posts store
- [x] Create auth store (optional)
- [x] Update Feed component
- [x] Update PostDetailPage
- [x] Add refresh functionality
- [x] Add CSS for refresh button
- [ ] Add persistence (optional)
- [ ] Add optimistic API updates (optional)

## Advanced Features (Optional)

### Optimistic Updates with Rollback

```typescript
const toggleLike = async (postId: string) => {
  const previousPosts = get().posts;

  // Optimistic update
  set((state) => ({
    posts: state.posts.map((post) =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ),
  }));

  try {
    // API call
    await db.updateDocument('posts', postId, { /* ... */ });
  } catch (error) {
    // Rollback on error
    set({ posts: previousPosts });
    console.error('Failed to like post:', error);
  }
};
```

### Subscriptions

```typescript
// Subscribe to specific posts
useEffect(() => {
  const unsubscribe = usePostsStore.subscribe(
    (state) => state.posts,
    (posts) => {
      console.log('Posts changed:', posts);
    }
  );

  return unsubscribe;
}, []);
```

## Troubleshooting

**Posts not updating?**
- Use `fetchPosts(true)` to force refresh

**Too many re-renders?**
- Use selectors to subscribe to specific state:
  ```tsx
  const posts = usePostsStore((state) => state.posts);
  const isLoading = usePostsStore((state) => state.isLoading);
  ```

**Cache not working?**
- Check `lastFetched` timestamp in store
- Verify `CACHE_DURATION` is set correctly

## Next Steps

1. Install dependencies: `npm install`
2. Test the refresh functionality
3. Monitor network tab to verify caching works
4. Consider adding persistence for offline support
5. Add optimistic updates for better UX
