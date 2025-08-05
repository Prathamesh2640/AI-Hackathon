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

const CollectionReports = () => {
  const navigation = useNavigation();
  const { fines, users } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const membershipFees = 1000; // Simulated monthly fee revenue
  const finesCollected = fines.reduce(
    (sum, fine) => sum + (fine.status === "Paid" ? fine.amount : 0),
    0
  );
  const totalCollections = membershipFees + finesCollected;
  const outstandingFines = fines.reduce(
    (sum, fine) => sum + (fine.status === "Unpaid" ? fine.amount : 0),
    0
  );
  const collectionEfficiency =
    totalCollections > 0
      ? ((finesCollected / (finesCollected + outstandingFines)) * 100).toFixed(
          2
        )
      : 0;

  const pendingPayments = fines
    .filter((fine) => fine.status === "Unpaid")
    .map((fine) => ({
      id: fine.id,
      userId: fine.userId,
      amount: fine.amount,
      reason: fine.reason,
      date: fine.date,
    }));

  const renderPendingPayment = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentText}>User ID: {item.userId}</Text>
      <Text style={styles.paymentText}>{item.reason}</Text>
      <Text style={styles.paymentAmount}>₹{item.amount}</Text>
      <Text style={styles.paymentDate}>{item.date}</Text>
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
          <Text style={styles.panelTitle}>Collection Reports</Text>
          <Text style={styles.panelSubtitle}>
            Overview of fees and fines collected
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Collection Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{totalCollections}</Text>
              <Text style={styles.kpiLabel}>Total Collections</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{membershipFees}</Text>
              <Text style={styles.kpiLabel}>Membership Fees</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{finesCollected}</Text>
              <Text style={styles.kpiLabel}>Fines Collected</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{outstandingFines}</Text>
              <Text style={styles.kpiLabel}>Outstanding Fines</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{collectionEfficiency}%</Text>
              <Text style={styles.kpiLabel}>Collection Efficiency</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Pending Payments</Text>
          {pendingPayments.length === 0 ? (
            <Text style={styles.noPaymentsText}>No outstanding payments</Text>
          ) : (
            <FlatList
              data={pendingPayments}
              renderItem={renderPendingPayment}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
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
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  paymentText: {
    fontSize: 16,
    color: "#333",
    flex: 2,
  },
  paymentAmount: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  paymentDate: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    textAlign: "right",
  },
  noPaymentsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default CollectionReports;
