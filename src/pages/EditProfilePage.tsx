import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout, Avatar, Button, Input, TextArea } from '../components/common';
import styles from './EditProfilePage.module.css';

export const EditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    avatarFile: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert('Profile updated! (This will be replaced with actual API integration)');
    setIsLoading(false);
    navigate('/profile');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    // TODO: Replace with actual API call
    alert('Account deletion will be implemented with your BaaS backend');
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
              src={user?.avatarUrl}
              alt={user?.displayName || 'User'}
              username={user?.displayName}
              size="xl"
            />
            <Button type="button" variant="outline" size="sm">
              Change Photo
            </Button>
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
