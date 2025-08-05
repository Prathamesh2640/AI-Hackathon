import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const UserStatistics = () => {
  const navigation = useNavigation();
  const { users, togglePaidStatus } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const paidUsers = users.filter((u) => u.isPaid).length;
  const unpaidUsers = users.length - paidUsers;

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userDetails}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userText}>Role: {item.role}</Text>
        <Text style={styles.userText}>Join Date: {item.joinDate}</Text>
        <Text style={styles.userText}>
          Status: {item.isPaid ? "Paid" : "Unpaid"}
        </Text>
      </View>
      {item.role === "member" && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => togglePaidStatus(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.isPaid ? "Mark Unpaid" : "Mark Paid"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("OwnerDashboard")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>User Statistics</Text>
          <Text style={styles.panelSubtitle}>
            Manage user accounts and memberships
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{users.length}</Text>
              <Text style={styles.kpiLabel}>Total Users</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{paidUsers}</Text>
              <Text style={styles.kpiLabel}>Paid Members</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{unpaidUsers}</Text>
              <Text style={styles.kpiLabel}>Unpaid Members</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>User List</Text>
          <Text style={styles.panelSubtitle}>Showing {users.length} users</Text>
          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
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
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  backLink: {
    padding: 10,
  },
  backLinkText: {
    color: "#007bff",
    fontSize: 16,
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
  sectionTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  kpiCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width / 2 - 30,
    minWidth: 150,
  },
  kpiNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  kpiLabel: {
    color: "#666",
    fontSize: 14,
    textTransform: "uppercase",
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default UserStatistics;
