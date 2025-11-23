import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout, Avatar, Button } from '../components/common';
import styles from './UserProfilePage.module.css';

export const MyProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const mockStats = {
    postsCount: 15,
    followersCount: 234,
    followingCount: 189,
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <Avatar
            src={user?.avatarUrl}
            alt={user?.displayName || 'User'}
            username={user?.displayName}
            size="xl"
          />

          <div className={styles.userInfo}>
            <h1 className={styles.displayName}>{user?.displayName}</h1>
            <p className={styles.username}>@{user?.username}</p>
            <p className={styles.bio}>{user?.bio || 'No bio yet'}</p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{mockStats.postsCount}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{mockStats.followersCount}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{mockStats.followingCount}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button onClick={() => navigate('/profile/edit')} variant="primary" fullWidth>
                Edit Profile
              </Button>
              <Button onClick={() => navigate('/settings')} variant="outline" fullWidth>
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
