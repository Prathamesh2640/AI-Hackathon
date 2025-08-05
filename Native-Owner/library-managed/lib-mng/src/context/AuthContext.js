import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, baseURL, setAuthToken } from "../api/axiosConfig";
import axios from "axios";
// import { api, setAuthToken } from "../api/axiosConfig";

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs on app startup to check for a stored session
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let storedUser;
      try {
        userToken = await AsyncStorage.getItem("userToken");
        storedUser = await AsyncStorage.getItem("user");
      } catch (e) {
        console.error("Restoring token failed", e);
      }

      if (userToken && storedUser) {
        setToken(userToken);
        setUser(JSON.parse(storedUser));
        // Set the token for all subsequent API requests
        setAuthToken(userToken);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  /**
   * Handles user login.
   * @param {string} username The user's username.
   * @param {string} password The user's password.
   * @returns {object} An object with `success: boolean` and an optional `message`.
   */
  const login = async (username, password) => {
    try {
      const response = await api.post(`/api/auth/login`, {
        username,
        password,
      });

      debugger;
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setAuthToken(token);

      // Store the session for persistence
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { success: true };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.message || "An unexpected error occurred.",
      };
    }
  };

  /**
   * Handles user logout. Clears all session data.
   */
  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null); // Clear the auth header

    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // The value provided to consuming components
  const authContextValue = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
