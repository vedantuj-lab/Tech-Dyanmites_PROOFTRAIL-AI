import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { loginApi, registerApi, fetchMeApi, logoutApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (email: string, pass: string, name: string, org?: string) => Promise<User>;
  logout: () => Promise<void>;
  switchRoleDemo?: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('prooftrail_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      fetchMeApi()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('prooftrail_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await loginApi(email, pass);
    localStorage.setItem('prooftrail_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (email: string, pass: string, name: string, org?: string): Promise<User> => {
    const res = await registerApi(email, pass, name, org);
    localStorage.setItem('prooftrail_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await logoutApi().catch(() => null);
    localStorage.removeItem('prooftrail_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
