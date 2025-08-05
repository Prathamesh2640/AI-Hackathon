import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import { api } from "../../api/axiosConfig";

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Validation Error", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Validation Error", "The new passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        "Validation Error",
        "The new password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/api/member/profile/change-password", {
        currentPassword,
        newPassword,
      });
      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Change Password Failed",
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Change Password" showBackButton />
      <ScrollView style={globalStyles.container}>
        <Text style={globalStyles.title}>Update Your Password</Text>
        <Text style={globalStyles.subtitle}>
          Enter your current and new password below.
        </Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={[globalStyles.input, styles.mt]}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={[globalStyles.input, styles.mt]}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[
            globalStyles.button,
            styles.mt,
            loading && styles.disabledButton,
          ]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  mt: { marginTop: 15 },
  disabledButton: { backgroundColor: Colors.textSecondary },
});

export default ChangePasswordScreen;
