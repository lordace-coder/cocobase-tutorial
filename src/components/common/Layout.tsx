import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from './Avatar';
import { Button } from './Button';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo} onClick={() => navigate('/')}>
            cocopow
          </h1>

          <nav className={styles.nav}>
            <button
              className={`${styles.navButton} ${isActive('/') ? styles.active : ''}`}
              onClick={() => navigate('/')}
              title="Home"
            >
              <span className={styles.navIcon}>🏠</span>
              <span className={styles.navText}>Home</span>
            </button>
            <button
              className={`${styles.navButton} ${location.pathname.startsWith('/search') ? styles.active : ''}`}
              onClick={() => navigate('/search')}
              title="Search"
            >
              <span className={styles.navIcon}>🔍</span>
              <span className={styles.navText}>Search</span>
            </button>
            <button
              className={`${styles.navButton} ${isActive('/notifications') ? styles.active : ''}`}
              onClick={() => navigate('/notifications')}
              title="Notifications"
            >
              <span className={styles.navIcon}>🔔</span>
              <span className={styles.navText}>Notifications</span>
            </button>
            <button
              className={`${styles.navButton} ${location.pathname.startsWith('/chat') ? styles.active : ''}`}
              onClick={() => navigate('/chats')}
              title="Messages"
            >
              <span className={styles.navIcon}>💬</span>
              <span className={styles.navText}>Messages</span>
            </button>
          </nav>

          <div className={styles.userSection}>
            <button
              className={styles.avatarButton}
              onClick={() => navigate('/profile')}
              title="Profile"
            >
              <Avatar
                src={user?.data.avatarUrl}
                alt={user?.data.displayName || 'User'}
                username={user?.data.displayName}
                size="sm"
              />
            </button>
            <span className={styles.username}>@{user?.data.username}</span>
            <Button onClick={logout} variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
