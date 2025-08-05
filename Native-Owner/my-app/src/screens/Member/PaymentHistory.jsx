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
import { paymentHistoryData } from "../../utils/dummyMemberData";

const { width } = Dimensions.get("window");

const PaymentHistory = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("MemberDashboard")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Payment History</Text>
          <Text style={styles.panelSubtitle}>
            View all your membership fees and fine payments
          </Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {paymentHistoryData.totalFeesPaid}
              </Text>
              <Text style={styles.kpiLabel}>Total Fees Paid</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {paymentHistoryData.totalFinesPaid}
              </Text>
              <Text style={styles.kpiLabel}>Total Fines Paid</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {paymentHistoryData.totalPaid}
              </Text>
              <Text style={styles.kpiLabel}>Total Paid</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {paymentHistoryData.lastPayment}
              </Text>
              <Text style={styles.kpiLabel}>Last Payment</Text>
            </View>
          </View>
          <Text style={styles.nextPayment}>
            {paymentHistoryData.nextPaymentDue}
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>All Transactions</Text>
          <Text style={styles.panelSubtitle}>
            Showing {paymentHistoryData.transactions.length} total transactions
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Description
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Date</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Type</Text>
            </View>
            {paymentHistoryData.transactions.map((txn, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.txnDescription}>{txn.description}</Text>
                  {txn.book && (
                    <Text style={styles.txnSubText}>Book: {txn.book}</Text>
                  )}
                  {txn.transactionId && (
                    <Text style={styles.txnSubText}>
                      ID: {txn.transactionId}
                    </Text>
                  )}
                </View>
                <Text style={styles.tableCell}>{txn.date}</Text>
                <Text style={styles.tableCell}>{txn.amount}</Text>
                <Text style={styles.tableCell}>{txn.type}</Text>
              </View>
            ))}
          </View>
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
    textAlign: "center",
  },
  nextPayment: {
    fontSize: 16,
    color: "#dc3545",
    marginTop: 10,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingVertical: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#666",
  },
  txnDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  txnSubText: {
    fontSize: 14,
    color: "#666",
  },
});

export default PaymentHistory;
