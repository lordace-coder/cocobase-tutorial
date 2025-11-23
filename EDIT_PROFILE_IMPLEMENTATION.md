# Edit Profile Implementation Guide

## Overview

The EditProfilePage has been fully implemented with support for updating user profile data and avatar uploads using Cocobase's authentication API.

## Features Implemented

### 1. Profile Data Updates
- Display Name editing
- Bio editing (with 160 character limit)
- Real-time character counter

### 2. Avatar Upload
- Image file selection via hidden input
- Image preview before uploading
- File validation (type and size)
- Support for all image formats
- Maximum file size: 5MB

### 3. Account Deletion
- Confirmation dialog before deletion
- Complete account removal via Cocobase
- Automatic logout and redirect to auth page

## Implementation Details

### Key Functions

#### 1. **handleAvatarChange** ([EditProfilePage.tsx:28-49](src/pages/EditProfilePage.tsx#L28-L49))

Handles avatar file selection with validation:

```typescript
const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // Validate file type - only images allowed
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size - max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setFormData({ ...formData, avatarFile: file });

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }
};
```

**Features:**
- ✅ Type validation (images only)
- ✅ Size validation (5MB max)
- ✅ Preview generation
- ✅ User-friendly error messages

#### 2. **handleSubmit** ([EditProfilePage.tsx:51-83](src/pages/EditProfilePage.tsx#L51-L83))

Handles profile update with smart API selection:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const updateData = {
      displayName: formData.displayName,
      bio: formData.bio,
    };

    // Smart API selection based on whether file is present
    if (formData.avatarFile) {
      // Use updateUserWithFiles when there's an avatar to upload
      await db.auth.updateUserWithFiles(
        updateData,           // data object
        null,                 // email (null = no change)
        null,                 // password (null = no change)
        { avatar: formData.avatarFile } // files object
      );
    } else {
      // Use updateUser when there's no file
      await db.auth.updateUser(updateData);
    }

    // Refresh user data in auth context
    refreshUser();

    alert('Profile updated successfully!');
    navigate('/profile');
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Failed to update profile. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

**Smart Features:**
- ✅ Chooses correct Cocobase API based on file presence
- ✅ Refreshes auth context after update
- ✅ Error handling with user feedback
- ✅ Loading state management
- ✅ Automatic navigation on success

#### 3. **handleDelete** ([EditProfilePage.tsx:85-100](src/pages/EditProfilePage.tsx#L85-L100))

Handles account deletion safely:

```typescript
const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    return;
  }

  try {
    setIsLoading(true);
    await db.auth.deleteUser();
    logout();
    navigate('/auth');
  } catch (error) {
    console.error('Failed to delete account:', error);
    alert('Failed to delete account. Please try again.');
    setIsLoading(false);
  }
};
```

**Safety Features:**
- ✅ Confirmation dialog
- ✅ Automatic logout after deletion
- ✅ Redirect to auth page
- ✅ Error handling

### UI Components

#### Avatar Section ([EditProfilePage.tsx:112-139](src/pages/EditProfilePage.tsx#L112-L139))

```tsx
<div className={styles.avatarSection}>
  <Avatar
    src={previewUrl || user?.data.avatarUrl}
    alt={user?.data.displayName || 'User'}
    username={user?.data.displayName}
    size="xl"
  />
  <input
    type="file"
    id="avatar-upload"
    accept="image/*"
    onChange={handleAvatarChange}
    style={{ display: 'none' }}
  />
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => document.getElementById('avatar-upload')?.click()}
  >
    Change Photo
  </Button>
  {formData.avatarFile && (
    <p className={styles.fileInfo}>
      {formData.avatarFile.name} ({(formData.avatarFile.size / 1024).toFixed(1)} KB)
    </p>
  )}
</div>
```

**Features:**
- Hidden file input for clean UI
- Button triggers file selection
- Shows preview of selected image
- Displays file name and size

### Auth Context Enhancement

Added `refreshUser` function to [useAuth.tsx:93-98](src/hooks/useAuth.tsx#L93-L98):

```typescript
const refreshUser = () => {
  const currentUser = db.auth.getUser();
  if (currentUser) {
    setUser(currentUser);
  }
};
```

**Purpose:** Updates auth context with latest user data after profile changes

## Cocobase API Reference

### Update User (without files)

```typescript
await db.auth.updateUser({
  displayName: 'New Name',
  bio: 'New bio',
  // any custom fields
});
```

### Update User (with files)

```typescript
await db.auth.updateUserWithFiles(
  data?: Record<string, any> | null,      // User data to update
  email?: string | null,                   // New email (null = no change)
  password?: string | null,                // New password (null = no change)
  files?: Record<string, File | File[]>    // Files to upload
);

// Example:
await db.auth.updateUserWithFiles(
  { displayName: 'John', bio: 'Hello' },  // data
  null,                                    // email (no change)
  null,                                    // password (no change)
  { avatar: imageFile }                    // files
);
```

### Delete User

```typescript
await db.auth.deleteUser();
```

## Styling

Added file info styling in [EditProfilePage.module.css:58-67](src/pages/EditProfilePage.module.css#L58-L67):

```css
.fileInfo {
  font-size: 0.813rem;
  color: var(--color-gray-600);
  text-align: center;
  margin: 0;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid var(--color-gray-200);
}
```

## Memory Management

Preview URL cleanup to prevent memory leaks ([EditProfilePage.tsx:19-26](src/pages/EditProfilePage.tsx#L19-L26)):

```typescript
useEffect(() => {
  return () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [previewUrl]);
```

## User Flow

```
1. User navigates to /profile/edit
   ↓
2. Form loads with current user data
   ↓
3. User edits fields and/or uploads avatar
   ↓
4. User clicks "Save Changes"
   ↓
5. Validation checks (if avatar selected)
   ↓
6. API call (updateUser or updateUserWithFiles)
   ↓
7. Auth context refreshed
   ↓
8. Success message shown
   ↓
9. Navigate to /profile
```

## Error Handling

All operations have comprehensive error handling:

- **File Validation**: Type and size checks before upload
- **API Errors**: Caught and displayed to user
- **Loading States**: Prevents duplicate submissions
- **User Feedback**: Clear success/error messages

## Testing Checklist

- [x] Update display name only
- [x] Update bio only
- [x] Update both display name and bio
- [x] Upload new avatar
- [x] Upload avatar + update profile data
- [x] File type validation (try non-image)
- [x] File size validation (try >5MB)
- [x] Preview shows selected image
- [x] Cancel button works
- [x] Profile page reflects changes
- [x] Auth context updates correctly
- [x] Delete account with confirmation
- [x] Delete account redirects properly

## Next Steps

Optional enhancements:
1. Add image cropping before upload
2. Add drag-and-drop for avatar upload
3. Add password change functionality
4. Add email change with verification
5. Add progress bar for file uploads
6. Add toast notifications instead of alerts
7. Add undo functionality

## Summary

The EditProfilePage is now fully functional with:
✅ Complete profile editing
✅ Avatar upload with validation and preview
✅ Smart API selection (with/without files)
✅ Account deletion
✅ Error handling and loading states
✅ Memory leak prevention
✅ Auth context synchronization
