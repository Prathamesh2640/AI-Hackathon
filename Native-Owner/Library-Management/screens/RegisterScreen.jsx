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

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { users, setUsers } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false, // Set to false to avoid RCTAnimation error
    }).start();
  }, []);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      Alert.alert("Error", "Email already registered");
      console.log("Registration failed: Email exists", { email, users });
      return;
    }
    const newUser = {
      id: `${Date.now()}`,
      email,
      password,
      role: "member",
      isPaid: false,
      joinDate: new Date().toISOString().split("T")[0],
    };
    try {
      setUsers([...users, newUser]);
      Alert.alert("Success", "Registration successful! Please log in.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
      console.log("Registration error:", error);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>Library Management System</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Register</Text>
          <Text style={styles.panelSubtitle}>Create a new account</Text>
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
          />
          <TextInput
            key="password-input"
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCorrect={false}
            returnKeyType="next"
          />
          <TextInput
            key="confirm-password-input"
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCorrect={false}
            onSubmitEditing={handleRegister}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRegister}
          >
            <Text style={styles.actionButtonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.linkButtonText}>
              Already have an account? Login
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

export default RegisterScreen;
