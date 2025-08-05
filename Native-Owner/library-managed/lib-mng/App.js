import "react-native-gesture-handler"; // Should be at the very top
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

/**
 * The root component of the application.
 * It sets up the global authentication context and renders the main navigator.
 */
export default function App() {
  return (
    // The AuthProvider wraps the entire app, making user session data
    // available to all screens and components.
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
