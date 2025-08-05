import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { borrowingHistoryData } from "../../utils/dummyMemberData";

const { width } = Dimensions.get("window");

const BorrowingHistory = () => {
  const navigation = useNavigation();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Records");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");

  const handleApplyFilters = () => {
    console.log("Filters applied:", {
      fromDate,
      toDate,
      statusFilter,
      subjectFilter,
    });
  };

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
          <Text style={styles.panelTitle}>Borrowing History</Text>
          <Text style={styles.panelSubtitle}>
            Complete record of all your book borrowing activities
          </Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>27</Text>
              <Text style={styles.kpiLabel}>Total Books Read</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>3</Text>
              <Text style={styles.kpiLabel}>Currently Borrowed</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>24</Text>
              <Text style={styles.kpiLabel}>Successfully Returned</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹25</Text>
              <Text style={styles.kpiLabel}>Total Fines Paid</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>2</Text>
              <Text style={styles.kpiLabel}>Favorite Subject: Programming</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Filters</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>From Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={fromDate}
                onChangeText={setFromDate}
              />
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>To Date</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={toDate}
                onChangeText={setToDate}
              />
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Status</Text>
              <Picker
                style={styles.picker}
                selectedValue={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <Picker.Item label="All Records" value="All Records" />
                <Picker.Item label="Returned" value="Returned" />
                <Picker.Item
                  label="Currently Borrowed"
                  value="Currently Borrowed"
                />
                <Picker.Item label="Overdue" value="Overdue" />
              </Picker>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Subject</Text>
              <Picker
                style={styles.picker}
                selectedValue={subjectFilter}
                onValueChange={(value) => setSubjectFilter(value)}
              >
                <Picker.Item label="All Subjects" value="All Subjects" />
                <Picker.Item label="Programming" value="Programming" />
                <Picker.Item label="Science" value="Science" />
                <Picker.Item label="Literature" value="Literature" />
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Borrowing History</Text>
          <Text style={styles.panelSubtitle}>
            Showing{" "}
            {borrowingHistoryData.currentBorrowings.length +
              borrowingHistoryData.pastBorrowings.length}{" "}
            total records
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Book Details
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Issue Date
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Due Date
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Return Date
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Status</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Fine</Text>
            </View>
            {borrowingHistoryData.currentBorrowings.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                  <Text style={styles.bookAuthor}>by {item.author}</Text>
                </View>
                <Text style={styles.tableCell}>{item.issueDate}</Text>
                <Text style={styles.tableCell}>{item.dueDate}</Text>
                <Text style={styles.tableCell}>{item.returnDate}</Text>
                <Text style={styles.tableCell}>{item.status}</Text>
                <Text style={styles.tableCell}>{item.fine}</Text>
              </View>
            ))}
            {borrowingHistoryData.pastBorrowings.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.bookTitle}>{item.bookTitle}</Text>
                  <Text style={styles.bookAuthor}>by {item.author}</Text>
                </View>
                <Text style={styles.tableCell}>{item.issueDate}</Text>
                <Text style={styles.tableCell}>{item.dueDate}</Text>
                <Text style={styles.tableCell}>{item.returnDate}</Text>
                <Text style={styles.tableCell}>{item.status}</Text>
                <Text style={styles.tableCell}>{item.fine}</Text>
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
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterItem: {
    flex: 1,
    minWidth: 150,
  },
  filterLabel: {
    color: "#333",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  applyButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "500",
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
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
  },
});

export default BorrowingHistory;
