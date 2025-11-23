# Notifications Implementation Guide

## Overview

The NotificationsPage has been fully integrated with Cocobase to fetch, display, and manage notifications in real-time.

## Features Implemented

### 1. Fetch Notifications from Cocobase
- Loads notifications for the current user
- Populates user data who triggered the notification
- Sorts by newest first
- Filters to show only notifications for current user

### 2. Mark as Read Functionality
- Single notification mark as read
- Mark all notifications as read
- Optimistic UI updates with error rollback
- Persists to Cocobase database

### 3. Filter System
- All notifications view
- Unread notifications only view
- Real-time unread count badge

### 4. Loading & Error States
- Loading state while fetching
- Error state with retry button
- Empty states for no notifications

## Implementation Details

### Fetching Notifications ([NotificationsPage.tsx:17-43](src/pages/NotificationsPage.tsx#L17-L43))

```typescript
useEffect(() => {
  const fetchNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedNotifications = await db.listDocuments<Notification>('notifications', {
        populate: ['user_id'],        // Populate user who triggered notification
        filters: {
          recipient_id: user.id,       // Only current user's notifications
        },
        sort: '-created_at',           // Newest first
      });

      setNotifications(fetchedNotifications as any);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchNotifications();
}, [user]);
```

**Key Features:**
- ✅ Filters by `recipient_id` to show only current user's notifications
- ✅ Populates `user_id` to get details of user who triggered notification
- ✅ Sorts by `-created_at` (descending) for newest first
- ✅ Error handling with user feedback
- ✅ Loading state management

### Mark as Read - Single ([NotificationsPage.tsx:47-69](src/pages/NotificationsPage.tsx#L47-L69))

```typescript
const handleMarkAsRead = async (id: string) => {
  try {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );

    // Update in database
    await db.updateDocument('notifications', id, {
      isRead: true,
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    // Revert optimistic update on error
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: false } : notif
      )
    );
  }
};
```

**Features:**
- ✅ Optimistic UI update (instant feedback)
- ✅ Persists to Cocobase
- ✅ Error rollback if API fails
- ✅ No loading spinner (feels instant)

### Mark All as Read ([NotificationsPage.tsx:71-99](src/pages/NotificationsPage.tsx#L71-L99))

```typescript
const handleMarkAllAsRead = async () => {
  const unreadNotifications = notifications.filter((n) => !n.isRead);

  try {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );

    // Update all unread notifications in database
    await Promise.all(
      unreadNotifications.map((notif) =>
        db.updateDocument('notifications', notif.id, {
          isRead: true,
        })
      )
    );
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    alert('Failed to mark all as read. Please try again.');
    // Revert optimistic update
    setNotifications((prev) =>
      prev.map((notif) => {
        const wasUnread = unreadNotifications.find((n) => n.id === notif.id);
        return wasUnread ? { ...notif, isRead: false } : notif;
      })
    );
  }
};
```

**Features:**
- ✅ Batch updates multiple notifications
- ✅ Uses `Promise.all` for parallel updates
- ✅ Optimistic UI with smart rollback
- ✅ Only updates unread notifications

### Loading State ([NotificationsPage.tsx:106-125](src/pages/NotificationsPage.tsx#L106-L125))

```typescript
if (isLoading) {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Notifications</h1>
          </div>
        </div>
        <div className={styles.notifications}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>⟳</span>
            <h3>Loading notifications...</h3>
            <p>Please wait</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### Error State ([NotificationsPage.tsx:127-153](src/pages/NotificationsPage.tsx#L127-L153))

```typescript
if (error) {
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.notifications}>
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>⚠️</span>
            <h3>Failed to load notifications</h3>
            <p>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="primary"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

## Database Schema Expected

Your Cocobase `notifications` collection should have:

```typescript
interface Notification {
  id: string;                    // Auto-generated
  type: NotificationType;        // 'like' | 'comment' | 'mention' | 'follow'
  user_id: string;               // User who triggered notification (populated)
  recipient_id: string;          // User receiving notification
  postId?: string;               // Related post ID (optional)
  commentId?: string;            // Related comment ID (optional)
  message: string;               // Notification message
  isRead: boolean;               // Read status
  created_at: string;            // Timestamp
}
```

## Cocobase API Calls

### Fetch Notifications
```typescript
db.listDocuments('notifications', {
  populate: ['user_id'],
  filters: {
    recipient_id: currentUserId,
  },
  sort: '-created_at',
});
```

### Mark as Read
```typescript
db.updateDocument('notifications', notificationId, {
  isRead: true,
});
```

## User Flow

```
1. User navigates to /notifications
   ↓
2. useEffect fetches notifications for current user
   ↓
3. Loading state shown (⟳)
   ↓
4. Notifications displayed with unread badge
   ↓
5. User clicks notification → marks as read
   ↓
6. Optimistic UI update (instant)
   ↓
7. API call to persist change
   ↓
8. If error → rollback UI update
```

## Features

### Filter System
- **All**: Shows all notifications
- **Unread**: Shows only unread notifications
- Active filter highlighted
- Empty state changes based on filter

### Unread Badge
- Shows count of unread notifications
- Updates in real-time
- Only shows when count > 0

### Optimistic Updates
- UI updates instantly before API call
- Better user experience (feels faster)
- Automatic rollback on error
- No loading spinners for mark as read

## Error Handling

All operations have comprehensive error handling:

- **Fetch Errors**: Shows error state with retry button
- **Mark as Read Errors**: Reverts UI silently
- **Mark All as Read Errors**: Shows alert + reverts UI
- **Network Errors**: Caught and logged

## Performance Optimizations

1. **Optimistic Updates**: Instant UI feedback
2. **Batch Updates**: `Promise.all` for mark all as read
3. **Smart Filtering**: Client-side filtering (no extra API calls)
4. **Conditional Rendering**: Only shows badge when needed

## Testing Checklist

- [x] Fetch notifications on mount
- [x] Show loading state while fetching
- [x] Display notifications correctly
- [x] Show unread count badge
- [x] Filter by all/unread
- [x] Mark single notification as read
- [x] Mark all notifications as read
- [x] Optimistic updates work
- [x] Error rollback works
- [x] Empty states show correctly
- [x] Error state shows retry button
- [x] User population works
- [x] Sorting (newest first) works

## Next Steps

Optional enhancements:
1. Real-time updates using WebSockets/polling
2. Push notifications
3. Notification grouping (e.g., "3 people liked your post")
4. Delete notifications
5. Notification settings/preferences
6. Mark as unread functionality
7. Pagination for large notification lists

## Summary

The NotificationsPage is now fully integrated with Cocobase:
✅ Fetches notifications from database
✅ Filters by current user
✅ Populates user who triggered notification
✅ Marks notifications as read (persisted)
✅ Optimistic UI updates
✅ Error handling with rollback
✅ Loading and error states
✅ Filter system (all/unread)
✅ Unread count badge
