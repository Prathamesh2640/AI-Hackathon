import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const { users } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false, // Set to false to avoid RCTAnimation error
    }).start();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      Alert.alert("Error", "Invalid email or password");
      console.log("Login failed: Invalid credentials", { email, users });
      return;
    }
    try {
      if (user.role === "member") {
        navigation.navigate("MemberDashboard");
      } else if (user.role === "owner") {
        navigation.navigate("OwnerDashboard");
      } else {
        Alert.alert("Error", "Invalid user role");
        console.log("Login failed: Invalid role", { user });
        return;
      }
      // Clear inputs only on successful login
      setEmail("");
      setPassword("");
    } catch (error) {
      Alert.alert("Error", "Navigation failed. Please try again.");
      console.log("Navigation error:", error);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>Library Management System</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Login</Text>
          <Text style={styles.panelSubtitle}>Access your account</Text>
        </View>

        <View style={styles.panel}>
          <TextInput
            key="email-input"
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => handleLogin()}
          />
          <TextInput
            key="password-input"
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={() => handleLogin()}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleLogin}>
            <Text style={styles.actionButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.linkButtonText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  mainContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  panel: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  panelTitle: {
    color: "#333",
    fontSize: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  panelSubtitle: {
    color: "#666",
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  linkButton: {
    marginTop: 10,
    alignSelf: "center",
  },
  linkButtonText: {
    color: "#007bff",
    fontSize: 14,
  },
});

export default LoginScreen;
