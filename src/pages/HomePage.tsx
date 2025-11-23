import { useAuth } from '../hooks/useAuth';
import { Feed } from '../components/feed';
import { Avatar, Button } from '../components/common';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>cocopow</h1>

          <div className={styles.userSection}>
            <Avatar
              src={user?.avatarUrl}
              alt={user?.displayName || 'User'}
              username={user?.displayName}
              size="sm"
            />
            <span className={styles.username}>@{user?.username}</span>
            <Button onClick={logout} variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Feed />
      </main>
    </div>
  );
};
