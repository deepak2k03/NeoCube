import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialize State on Load (Prevent "Guest" flash)
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          // If data exists, we are logged in
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        } else {
          // If missing data, ensure we are logged out
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth Initialization Error:", error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 2. Login Action
  // This expects the token and user data that Login.jsx fetched
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update State IMMEDIATELY to fix the loop
    setUser(userData);
    setIsAuthenticated(true);
  };

  // 3. Logout Action
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Force a hard redirect to ensure all states are cleared
    window.location.href = '/login'; 
  };

  // 4. Update Profile Action (Optional helper)
  const updateProfile = (userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // 5. Context Value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;