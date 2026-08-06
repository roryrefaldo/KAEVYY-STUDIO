import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  UserStatus,
  LoginCredentials,
  ClientRegisterData,
  DeveloperRegisterData,
  AuthPermissions,
} from '../../types/auth';
import { AuthService, DEMO_USERS } from '../services/authService';
import { getPermissionsForUser } from '../services/roleService';
import { useLanguage } from '../../i18n/LanguageContext';

export interface AuthContextType {
  user: User | null;
  role: UserRole;
  status: UserStatus;
  permissions: AuthPermissions;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPassword: (credentials: LoginCredentials) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginWithDiscord: () => Promise<User>;
  registerClient: (data: ClientRegisterData) => Promise<User>;
  registerDeveloper: (data: DeveloperRegisterData) => Promise<User>;
  switchDemoUser: (demoKey: keyof typeof DEMO_USERS) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateDeveloperStatus: (
    userId: string,
    newStatus: 'PENDING' | 'VERIFIED' | 'ELITE' | 'REJECTED' | 'SUSPENDED'
  ) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setLanguage, setCurrency } = useLanguage();
  const [user, setUser] = useState<User | null>(() => AuthService.getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      if (user.language) setLanguage(user.language);
      if (user.currency) setCurrency(user.currency);
    }
  }, []);

  const handleUserSession = (newUser: User | null) => {
    setUser(newUser);
    AuthService.setStoredUser(newUser);
    if (newUser) {
      if (newUser.language) setLanguage(newUser.language);
      if (newUser.currency) setCurrency(newUser.currency);
    }
  };

  const loginWithPassword = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const loggedUser = await AuthService.loginWithPassword(credentials);
      handleUserSession(loggedUser);
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    setIsLoading(true);
    try {
      const googleUser = await AuthService.loginWithGoogle();
      handleUserSession(googleUser);
      return googleUser;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDiscord = async (): Promise<User> => {
    setIsLoading(true);
    try {
      const discordUser = await AuthService.loginWithDiscord();
      handleUserSession(discordUser);
      return discordUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (data: ClientRegisterData): Promise<User> => {
    setIsLoading(true);
    try {
      const newClient = await AuthService.registerClient(data);
      handleUserSession(newClient);
      return newClient;
    } finally {
      setIsLoading(false);
    }
  };

  const registerDeveloper = async (data: DeveloperRegisterData): Promise<User> => {
    setIsLoading(true);
    try {
      const newDev = await AuthService.registerDeveloper(data);
      handleUserSession(newDev);
      return newDev;
    } finally {
      setIsLoading(false);
    }
  };

  const switchDemoUser = (demoKey: keyof typeof DEMO_USERS) => {
    const demoUser = DEMO_USERS[demoKey];
    if (demoUser) {
      handleUserSession(demoUser);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    handleUserSession(updatedUser);
  };

  const updateDeveloperStatus = (
    userId: string,
    newStatus: 'PENDING' | 'VERIFIED' | 'ELITE' | 'REJECTED' | 'SUSPENDED'
  ) => {
    if (user && user.id === userId && user.developerProfile) {
      const updatedUser: User = {
        ...user,
        status:
          newStatus === 'VERIFIED' || newStatus === 'ELITE'
            ? 'ACTIVE'
            : newStatus === 'SUSPENDED'
            ? 'SUSPENDED'
            : 'PENDING_VERIFICATION',
        developerProfile: {
          ...user.developerProfile,
          verificationStatus: newStatus,
        },
      };
      handleUserSession(updatedUser);
    }
  };

  const role: UserRole = user ? user.role : 'PUBLIC';
  const status: UserStatus = user ? user.status : 'ACTIVE';
  const permissions = getPermissionsForUser(user);
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        status,
        permissions,
        isAuthenticated,
        isLoading,
        loginWithPassword,
        loginWithGoogle,
        loginWithDiscord,
        registerClient,
        registerDeveloper,
        switchDemoUser,
        logout,
        updateProfile,
        updateDeveloperStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
