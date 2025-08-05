import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { Colors, globalStyles } from "../../styles/globalStyles";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Input Error", "Please enter both username and password.");
      return;
    }
    setIsLoggingIn(true);
    const result = await login(username, password);
    setIsLoggingIn(false);

    if (!result.success) {
      Alert.alert(
        "Login Failed",
        result.message || "An unexpected error occurred."
      );
    }
    // Successful navigation is handled by the AppNavigator, which listens to the AuthContext state change.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Library Management System</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <View style={styles.form}>
          <TextInput
            style={globalStyles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            style={[globalStyles.input, { marginTop: 15 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={Colors.placeholder}
          />

          <TouchableOpacity
            style={[globalStyles.button, styles.signInButton]}
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={globalStyles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  signInButton: {
    marginTop: 20,
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    color: Colors.info,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default LoginScreen;
