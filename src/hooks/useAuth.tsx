import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthUser, LoginCredentials, SignupCredentials } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // TODO: Replace with actual API call to your BaaS
    // This is a mock implementation
    const mockUser: AuthUser = {
      id: '1',
      username: credentials.email.split('@')[0],
      displayName: credentials.email.split('@')[0],
      email: credentials.email,
      accessToken: 'mock-token',
      createdAt: new Date(),
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const signup = async (credentials: SignupCredentials) => {
    // TODO: Replace with actual API call to your BaaS
    const mockUser: AuthUser = {
      id: '1',
      username: credentials.username,
      displayName: credentials.displayName,
      email: credentials.email,
      accessToken: 'mock-token',
      createdAt: new Date(),
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const loginWithGoogle = async (credential: string) => {
    // TODO: Replace with actual API call to your BaaS
    // Decode the Google credential and create user
    const mockUser: AuthUser = {
      id: '1',
      username: 'googleuser',
      displayName: 'Google User',
      email: 'user@gmail.com',
      accessToken: credential,
      createdAt: new Date(),
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
