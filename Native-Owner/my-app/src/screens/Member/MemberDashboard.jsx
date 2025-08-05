import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { memberDashboardData } from "../../utils/dummyMemberData";

const { width } = Dimensions.get("window");

const MemberDashboard = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userRole}>Member</Text>
            <Text style={styles.userName}>
              {memberDashboardData.welcome.name}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("LoginScreen")}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.welcomeTitle}>
            Welcome Back, {memberDashboardData.welcome.name}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            {memberDashboardData.welcome.message}
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Overview</Text>
          <View style={styles.kpiGrid}>
            {memberDashboardData.kpis.map((item, index) => (
              <View key={index} style={styles.kpiCard}>
                <Text style={styles.kpiNumber}>{item.value}</Text>
                <Text style={styles.kpiLabel}>{item.label}</Text>
                <Text style={[styles.kpiTrend, styles[item.trend]]}>
                  {item.trend === "positive"
                    ? "↑"
                    : item.trend === "negative"
                    ? "↓"
                    : "–"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {memberDashboardData.quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
              >
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Recent Activity</Text>
          {memberDashboardData.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityDescription}>
                {activity.description}
              </Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  userRole: {
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  userName: {
    color: "#333",
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "transparent",
    borderRadius: 5,
  },
  btnText: {
    color: "#333",
    fontWeight: "500",
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
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  panelTitle: {
    color: "#333",
    fontSize: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
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
    letterSpacing: 1,
    marginBottom: 5,
    textAlign: "center",
  },
  kpiTrend: {
    fontSize: 13,
    fontWeight: "500",
  },
  positive: {
    color: "#28a745",
  },
  negative: {
    color: "#dc3545",
  },
  neutral: {
    color: "#666",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  actionCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    width: width / 2 - 30,
    minWidth: 150,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  actionDescription: {
    fontSize: 14,
    color: "#666",
  },
  activityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  activityDescription: {
    fontSize: 16,
    color: "#333",
  },
  activityTime: {
    fontSize: 14,
    color: "#666",
  },
});

export default MemberDashboard;
