import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const OwnerDashboard = () => {
  const navigation = useNavigation();
  const { users, books, borrowings, fines, calculateOverdueFines } =
    useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    calculateOverdueFines();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const totalRevenue = fines.reduce(
    (sum, fine) => sum + (fine.status === "Paid" ? fine.amount : 0),
    0
  );
  const activeMembers = users.filter((u) => u.isPaid).length;
  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const booksInCirculation = borrowings.filter(
    (b) => b.status !== "Returned"
  ).length;
  const assetValue = books.reduce(
    (sum, book) =>
      sum + parseFloat(book.price.replace("₹", "")) * book.totalCopies,
    0
  );
  const alerts =
    fines.filter((f) => f.status === "Unpaid").length > 0
      ? [
          `${
            fines.filter((f) => f.status === "Unpaid").length
          } unpaid fines detected`,
        ]
      : ["No critical alerts"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("LoginScreen")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.mainContent, { opacity: fadeAnim }]}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Owner Dashboard</Text>
          <Text style={styles.panelSubtitle}>
            Overview of library operations
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{totalRevenue}</Text>
              <Text style={styles.kpiLabel}>Monthly Revenue</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{activeMembers}</Text>
              <Text style={styles.kpiLabel}>Active Members</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{totalBooks}</Text>
              <Text style={styles.kpiLabel}>Total Books</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{booksInCirculation}</Text>
              <Text style={styles.kpiLabel}>Books in Circulation</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{assetValue.toFixed(2)}</Text>
              <Text style={styles.kpiLabel}>Asset Value</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>System Alerts</Text>
          {alerts.map((alert, index) => (
            <Text key={index} style={styles.alertText}>
              {alert}
            </Text>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("UserStatistics")}
            >
              <Text style={styles.actionButtonText}>User Statistics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("BookInventory")}
            >
              <Text style={styles.actionButtonText}>Book Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("FinancialReports")}
            >
              <Text style={styles.actionButtonText}>Financial Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("CollectionReports")}
            >
              <Text style={styles.actionButtonText}>Collection Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("AssetReports")}
            >
              <Text style={styles.actionButtonText}>Asset Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("BookManagement")}
            >
              <Text style={styles.actionButtonText}>Book Management</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("BorrowReturn")}
            >
              <Text style={styles.actionButtonText}>Borrow/Return</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("OverdueBooks")}
            >
              <Text style={styles.actionButtonText}>Overdue Books</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
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
  alertText: {
    fontSize: 16,
    color: "#dc3545",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
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

export default OwnerDashboard;
