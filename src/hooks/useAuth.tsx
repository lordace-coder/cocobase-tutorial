import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { AuthUser, LoginCredentials, SignupCredentials } from "../types";
import db from "@/lib/cocobase";
import { AppUser } from "cocobase";

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage asynchronously
    const initializeAuth = async () => {
      try {
        await db.auth.initAuth();
        const currentUser = db.auth.getUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (cred: LoginCredentials) => {
    await db.auth.login(cred.email, cred.password);
    if (db.auth.isAuthenticated()) {
      setUser(db.auth.getUser()!);
    }
  };

  const signup = async (cred: SignupCredentials) => {
    const formattedName = cred.username.replace(" ", "").replace("@", "");
    // first check if user with name already exists
    const exists = await db.auth.listUsers({
      filters: {
        "[or]:username": formattedName,
        "[or]:email": cred.email,
      },
    });
    if (exists.total > 0) {
      const firstUser = exists.data[0];
      if (firstUser.email) {
        throw new Error("User with this email already exists");
      } else if (firstUser.data.username == formattedName) {
        throw new Error("User with this username or email already exists");
      }
    }
    await db.auth.register(cred.email, cred.password, {
      username: formattedName,
      displayName: cred.displayName,
    });
    if (db.auth.isAuthenticated()) {
      setUser(db.auth.getUser()!);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    await db.auth.loginWithGoogle(credential);

    if (db.auth.isAuthenticated()) {
      setUser(db.auth.getUser()!);
    }
  };

  const logout = () => {
    db.auth.logout();
    setUser(null);
  };

  const refreshUser = () => {
    const currentUser = db.auth.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
