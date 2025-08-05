import { StyleSheet } from "react-native";

export const Colors = {
  primary: "#333",
  secondary: "#555",
  background: "#f8f9fa",
  surface: "#ffffff",
  text: "#333",
  textSecondary: "#666",
  placeholder: "#aaa",
  border: "#e9ecef",
  white: "#ffffff",
  success: "#28a745",
  successLight: "#d4edda",
  warning: "#ffc107",
  warningLight: "#fff3cd",
  danger: "#dc3545",
  dangerLight: "#f8d7da",
  info: "#007bff",
  infoLight: "#cce5ff",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonTextSecondary: {
    color: Colors.primary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});
