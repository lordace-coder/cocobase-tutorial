import { useState } from 'react';
import { LoginForm, SignupForm, GoogleLoginButton } from '../components/auth';
import styles from './AuthPage.module.css';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.branding}>
          <h1 className={styles.logo}>cocopow</h1>
          <p className={styles.tagline}>Connect, Share, and Engage with Your Community</p>
        </div>

        <div className={styles.formContainer}>
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggleForm={() => setIsLogin(true)} />
          )}

          <GoogleLoginButton />
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>📸</span>
          <h3>Share Moments</h3>
          <p>Post photos, videos, and thoughts</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>💬</span>
          <h3>Engage</h3>
          <p>Comment and mention friends</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>#</span>
          <h3>Discover</h3>
          <p>Find content with hashtags</p>
        </div>
      </div>
    </div>
  );
};
