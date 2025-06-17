'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from '@/middleware'; // Import the cookie name

interface AuthContextType {
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for the auth cookie when the app loads
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    if (authCookie) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/check-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        Cookies.set(AUTH_COOKIE_NAME, 'true', { expires: 7 }); // Cookie expires in 7 days
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Login failed:', data.error);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    setIsAuthenticated(false);
    // Optionally, redirect to landing page or refresh to ensure middleware kicks in
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 