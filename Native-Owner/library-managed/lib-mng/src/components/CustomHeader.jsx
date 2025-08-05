import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Colors } from "../styles/globalStyles";

const CustomHeader = ({ title, showBackButton = false }) => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.logo}>LMS</Text>
        )}

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.surface,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    height: Platform.OS === "android" ? 60 : 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    width: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },
  backButton: {
    width: 80,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  logoutButton: {
    width: 80,
    alignItems: "flex-end",
  },
  logoutButtonText: {
    fontSize: 16,
    color: Colors.danger,
  },
});

export default CustomHeader;
