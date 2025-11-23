import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../../hooks/useAuth';
import styles from './GoogleLoginButton.module.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

export const GoogleLoginButton = () => {
  const { loginWithGoogle } = useAuth();

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      await loginWithGoogle(credentialResponse.credential);
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={styles.wrapper}>
        <div className={styles.divider}>
          <span>or</span>
        </div>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
          width="100%"
        />
      </div>
    </GoogleOAuthProvider>
  );
};
