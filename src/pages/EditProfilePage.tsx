import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout, Avatar, Button, Input, TextArea } from '../components/common';
import styles from './EditProfilePage.module.css';
import db from '@/lib/cocobase';

export const EditProfilePage = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: user?.data.displayName || '',
    bio: user?.data.bio || '',
    avatarFile: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
      };

      // Check if we have a file to upload
      if (formData.avatarFile) {
        // Use updateUserWithFiles when there's an avatar to upload
        await db.auth.updateUserWithFiles(
          updateData,
          null, // email (null = no change)
          null, // password (null = no change)
          { avatar: formData.avatarFile } // files object with avatar
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      // await db.aut;
      logout();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1 className={styles.title}>Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
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

          <Input
            label="Display Name"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            placeholder="Your display name"
          />

          <TextArea
            label="Bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={4}
            showCount
            maxCount={160}
          />

          <div className={styles.actions}>
            <Button type="submit" isLoading={isLoading} variant="primary" fullWidth>
              Save Changes
            </Button>
            <Button type="button" onClick={() => navigate(-1)} variant="ghost" fullWidth>
              Cancel
            </Button>
          </div>

          <div className={styles.dangerZone}>
            <h3>Danger Zone</h3>
            <p>Once you delete your account, there is no going back.</p>
            <Button type="button" onClick={handleDelete} variant="outline">
              Delete Account
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
