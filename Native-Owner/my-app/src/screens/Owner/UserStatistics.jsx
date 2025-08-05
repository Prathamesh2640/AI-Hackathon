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
  const { users, borrowings } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const totalMembers = users.filter((u) => u.role === "member").length;
  const activeMembers = users.filter(
    (u) => u.isPaid && u.role === "member"
  ).length;
  const inactiveMembers = totalMembers - activeMembers;
  const newMembers = users.filter((u) => {
    const joinDate = new Date(u.joinDate || "2025-01-01");
    const today = new Date();
    const diffDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  const activityLevels = {
    high: borrowings.filter((b) => {
      const borrowDate = new Date(b.issueDate);
      const today = new Date();
      return Math.floor((today - borrowDate) / (1000 * 60 * 60 * 24)) <= 30;
    }).length,
    medium: borrowings.filter((b) => {
      const borrowDate = new Date(b.issueDate);
      const today = new Date();
      const diffDays = Math.floor((today - borrowDate) / (1000 * 60 * 60 * 24));
      return diffDays > 30 && diffDays <= 90;
    }).length,
    low: borrowings.filter((b) => {
      const borrowDate = new Date(b.issueDate);
      const today = new Date();
      const diffDays = Math.floor((today - borrowDate) / (1000 * 60 * 60 * 24));
      return diffDays > 90;
    }).length,
    inactive: users.filter(
      (u) => u.role === "member" && !borrowings.some((b) => b.userId === u.id)
    ).length,
  };

  const recentActivities = borrowings.slice(0, 5).map((b) => ({
    id: b.id,
    description: `${
      b.status === "Returned" ? "Returned" : "Borrowed"
    } book (Copy ${b.copyId})`,
    date: b.status === "Returned" ? b.returnDate : b.issueDate,
  }));

  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>{item.description}</Text>
      <Text style={styles.activityDate}>{item.date}</Text>
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
            Insights into member activity and engagement
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Membership Overview</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{totalMembers}</Text>
              <Text style={styles.kpiLabel}>Total Members</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{activeMembers}</Text>
              <Text style={styles.kpiLabel}>Active Members</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{inactiveMembers}</Text>
              <Text style={styles.kpiLabel}>Inactive Members</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{newMembers}</Text>
              <Text style={styles.kpiLabel}>New Members (Last 30 Days)</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Activity Levels</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{activityLevels.high}</Text>
              <Text style={styles.kpiLabel}>High Activity</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{activityLevels.medium}</Text>
              <Text style={styles.kpiLabel}>Medium Activity</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{activityLevels.low}</Text>
              <Text style={styles.kpiLabel}>Low Activity</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{activityLevels.inactive}</Text>
              <Text style={styles.kpiLabel}>Inactive</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Recent Member Activities</Text>
          <FlatList
            data={recentActivities}
            renderItem={renderActivity}
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
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  activityText: {
    fontSize: 16,
    color: "#333",
  },
  activityDate: {
    fontSize: 16,
    color: "#666",
  },
});

export default UserStatistics;
