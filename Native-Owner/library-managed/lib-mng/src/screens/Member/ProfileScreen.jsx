import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";

const ProfileScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  // login function is also needed if we want to refresh user state globally
  // for simplicity, we won't re-login here, but in a real app you might.

  const [fullName, setFullName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert(
        "Validation Error",
        "Please ensure Full Name and Email are filled in."
      );
      return;
    }
    setLoading(true);
    try {
      await api.put("/api/member/profile", { full_name: fullName, email });
      Alert.alert(
        "Success",
        "Your profile has been updated. The change will be reflected the next time you log in."
      );
      // In a more complex app, you would update the user object in AuthContext here.
    } catch (error) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.message ||
          "An error occurred while updating your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="My Profile" showBackButton />
      <ScrollView style={globalStyles.container}>
        <Text style={globalStyles.title}>Edit Your Profile</Text>

        <Text style={styles.label}>Username (Cannot be changed)</Text>
        <TextInput
          style={[globalStyles.input, styles.disabledInput]}
          value={user.username}
          editable={false}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={globalStyles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[globalStyles.button, styles.button]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonSecondary,
            { marginTop: 10 },
          ]}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Text
            style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}
          >
            Change Password
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  label: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 20,
    marginBottom: 5,
  },
  disabledInput: {
    backgroundColor: Colors.border,
    color: Colors.textSecondary,
  },
  button: { marginTop: 30 },
});

export default ProfileScreen;
