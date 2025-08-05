import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { api } from "../../api/axiosConfig";
import { Colors, globalStyles } from "../../styles/globalStyles";

const RegistrationScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Basic Client-Side Validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Input Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Input Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Input Error",
        "Password must be at least 6 characters long."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/register", {
        full_name: fullName,
        username,
        email,
        password,
      });

      Alert.alert(
        "Registration Successful",
        "Your account has been created. Please log in.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during registration.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our library community</Text>

        <View style={styles.form}>
          <TextInput
            style={globalStyles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            style={[globalStyles.input, styles.inputSpacing]}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            style={[globalStyles.input, styles.inputSpacing]}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            style={[globalStyles.input, styles.inputSpacing]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={Colors.placeholder}
          />
          <TextInput
            style={[globalStyles.input, styles.inputSpacing]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={Colors.placeholder}
          />

          <TouchableOpacity
            style={[globalStyles.button, styles.registerButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={globalStyles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>Sign in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
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
  inputSpacing: {
    marginTop: 15,
  },
  registerButton: {
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

export default RegistrationScreen;
