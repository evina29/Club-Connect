import React, {createContext, useState, useEffect, useContext} from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = AuthService.onAuthStateChanged(async currentUser => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user profile
        const result = await AuthService.getUserProfile(currentUser.uid);
        if (result.success) {
          setUserProfile(result.data);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, userData) => {
    const result = await AuthService.registerUser(email, password, userData);
    return result;
  };

  const login = async (email, password) => {
    const result = await AuthService.loginUser(email, password);
    return result;
  };

  const logout = async () => {
    const result = await AuthService.logoutUser();
    if (result.success) {
      setUser(null);
      setUserProfile(null);
    }
    return result;
  };

  const resetPassword = async email => {
    const result = await AuthService.resetPassword(email);
    return result;
  };

  const updateProfile = async updates => {
    if (!user) return {success: false, error: 'No user logged in'};

    const result = await AuthService.updateUserProfile(user.uid, updates);
    if (result.success) {
      setUserProfile(prev => ({...prev, ...updates}));
    }
    return result;
  };

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
    resetPassword,
    updateProfile,
    isAdmin: userProfile?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
