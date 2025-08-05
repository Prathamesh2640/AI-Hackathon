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

const FinancialReports = () => {
  const navigation = useNavigation();
  const { fines } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const monthlyRevenue = fines.reduce(
    (sum, fine) => sum + (fine.status === "Paid" ? fine.amount : 0),
    0
  );
  const membershipFees = 1000; // Simulated monthly fee revenue
  const totalRevenue = monthlyRevenue + membershipFees;
  const expenses = {
    staff: 5000,
    acquisitions: 2000,
    utilities: 1000,
    other: 500,
  };
  const totalExpenses = Object.values(expenses).reduce(
    (sum, val) => sum + val,
    0
  );
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin =
    totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0;

  const transactions = fines
    .map((fine) => ({
      id: fine.id,
      description: `${fine.status} Fine (Copy ${fine.copyId})`,
      amount: fine.amount,
      type: "Fine",
      date: fine.date,
    }))
    .concat([
      {
        id: "t1",
        description: "Membership Fees",
        amount: membershipFees,
        type: "Fee",
        date: "2025-08-01",
      },
    ]);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>{item.description}</Text>
      <Text style={styles.transactionAmount}>₹{item.amount}</Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
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
          <Text style={styles.panelTitle}>Financial Reports</Text>
          <Text style={styles.panelSubtitle}>
            Overview of library financial performance
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{totalRevenue}</Text>
              <Text style={styles.kpiLabel}>Total Revenue</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{totalExpenses}</Text>
              <Text style={styles.kpiLabel}>Total Expenses</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{netProfit}</Text>
              <Text style={styles.kpiLabel}>Net Profit</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{profitMargin}%</Text>
              <Text style={styles.kpiLabel}>Profit Margin</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownText}>
              Membership Fees: ₹{membershipFees}
            </Text>
            <Text style={styles.breakdownText}>
              Fines Collected: ₹{monthlyRevenue}
            </Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Expense Breakdown</Text>
          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownText}>
              Staff Salaries: ₹{expenses.staff}
            </Text>
            <Text style={styles.breakdownText}>
              Book Acquisitions: ₹{expenses.acquisitions}
            </Text>
            <Text style={styles.breakdownText}>
              Utilities: ₹{expenses.utilities}
            </Text>
            <Text style={styles.breakdownText}>Other: ₹{expenses.other}</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
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
  breakdownContainer: {
    paddingVertical: 10,
  },
  breakdownText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  transactionText: {
    fontSize: 16,
    color: "#333",
    flex: 2,
  },
  transactionAmount: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  transactionDate: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    textAlign: "right",
  },
});

export default FinancialReports;
