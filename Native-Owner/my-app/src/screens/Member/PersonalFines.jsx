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
import { outstandingFinesData } from "../../utils/dummyMemberData";

const { width } = Dimensions.get("window");

const PersonalFines = () => {
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
          <Text style={styles.panelTitle}>Outstanding Fines</Text>
          <Text style={styles.panelSubtitle}>
            View and manage any pending fine payments
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.statusIcon}>✓</Text>
          <Text style={styles.statusMessage}>
            Great news! You currently have no outstanding fines. Keep up the
            good work with timely book returns!
          </Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {outstandingFinesData.totalFines}
              </Text>
              <Text style={styles.kpiLabel}>Current Outstanding</Text>
              <Text style={styles.kpiSubLabel}>No pending fines</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {outstandingFinesData.totalFinesPaid}
              </Text>
              <Text style={styles.kpiLabel}>Total Fines Paid</Text>
              <Text style={styles.kpiSubLabel}>Lifetime total</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {outstandingFinesData.lateReturns}
              </Text>
              <Text style={styles.kpiLabel}>Late Returns</Text>
              <Text style={styles.kpiSubLabel}>Historical count</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {outstandingFinesData.fineRate}
              </Text>
              <Text style={styles.kpiLabel}>Fine Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Fine Details</Text>
          <Text style={styles.statusIcon}>🎉</Text>
          <Text style={styles.statusMessage}>You're in Good Standing!</Text>
          <Text style={styles.statusSubMessage}>
            All your books are returned on time and you have no outstanding
            fines to pay.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("BorrowedBooks")}
            >
              <Text style={styles.actionButtonText}>View Current Books</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("PaymentHistory")}
            >
              <Text style={styles.actionButtonText}>Payment History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>How Fine Calculation Works</Text>
          <View style={styles.calculationContainer}>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Return Period</Text>
              <Text style={styles.calculationValue}>
                7 days from issue date
              </Text>
            </View>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Fine Rate</Text>
              <Text style={styles.calculationValue}>₹5 per day</Text>
            </View>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Grace Period</Text>
              <Text style={styles.calculationValue}>
                None (fines start immediately)
              </Text>
            </View>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Maximum Fine</Text>
              <Text style={styles.calculationValue}>No limit</Text>
            </View>
          </View>
          <Text style={styles.calculationFormula}>
            {outstandingFinesData.calculation}
          </Text>
          <Text style={styles.calculationExample}>
            {outstandingFinesData.example}
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Tips to Avoid Fines</Text>
          {outstandingFinesData.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <Text style={styles.tipText}>{tip}</Text>
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
  statusIcon: {
    fontSize: 24,
    color: "#28a745",
    textAlign: "center",
    marginBottom: 10,
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  statusSubMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
  kpiSubLabel: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
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
  calculationContainer: {
    marginBottom: 10,
  },
  calculationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  calculationLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  calculationValue: {
    fontSize: 14,
    color: "#666",
  },
  calculationFormula: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  calculationExample: {
    fontSize: 14,
    color: "#666",
  },
  tipItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tipNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  tipText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
});

export default PersonalFines;
