import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  LOADING_START: 'LOADING_START',
  LOADING_END: 'LOADING_END',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
      };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };

    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };

    case AUTH_ACTIONS.LOADING_START:
      return {
        ...state,
        isLoading: true,
      };

    case AUTH_ACTIONS.LOADING_END:
      return {
        ...state,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getStoredToken();
      const user = authService.getStoredUser();

      if (token && user) {
        try {
          // Verify token is still valid
          const response = await authService.getCurrentUser();
          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: {
              user: response.data.user,
              token,
            },
          });
        } catch (error) {
          // Token is invalid, clear it
          authService.clearAuthData();
          dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });

    try {
      const response = await authService.login(credentials);
      const { user, token } = response.data;

      // Store auth data
      authService.storeAuthData(user, token);

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user, token },
      });

      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.AUTH_START });

    try {
      const response = await authService.register(userData);
      const { user, token } = response.data;

      // Store auth data
      authService.storeAuthData(user, token);

      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user, token },
      });

      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.clearAuthData();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Update user profile
  const updateProfile = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });

    // Update stored user data
    const currentUser = authService.getStoredUser();
    if (currentUser) {
      authService.storeAuthData({ ...currentUser, ...userData }, state.token);
    }
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};