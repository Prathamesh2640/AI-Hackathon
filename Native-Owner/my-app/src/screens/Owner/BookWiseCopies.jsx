import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { bookWiseCopiesData } from "../../utils/dummyData";

const { width } = Dimensions.get("window");

const BookWiseCopies = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userRole}>Owner</Text>
            <Text style={styles.userName}>Mr. James Wilson</Text>
            <TouchableOpacity
              onPress={() => console.log("Sign Out pressed")}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Book-wise Copies Report</Text>
          <Text style={styles.panelSubtitle}>
            Detailed analysis of copy distribution and utilization for each book
            title
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Overview</Text>
          <View style={styles.kpiGrid}>
            {bookWiseCopiesData.overview.map((item, index) => (
              <View key={index} style={styles.kpiCard}>
                <Text style={styles.kpiNumber}>{item.value}</Text>
                <Text style={styles.kpiLabel}>{item.label}</Text>
                <Text style={[styles.kpiTrend, styles[item.trend]]}>
                  {item.change}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Filters</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Subject Filter</Text>
              <Picker
                style={styles.picker}
                onValueChange={() => console.log("Subject Filter changed")}
              >
                <Picker.Item label="All Subjects" value="all" />
                <Picker.Item label="Programming" value="programming" />
                <Picker.Item label="Science" value="science" />
                <Picker.Item label="Literature" value="literature" />
                <Picker.Item label="History" value="history" />
                <Picker.Item label="Mathematics" value="mathematics" />
              </Picker>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Utilization Filter</Text>
              <Picker
                style={styles.picker}
                onValueChange={() => console.log("Utilization Filter changed")}
              >
                <Picker.Item label="All Books" value="all" />
                <Picker.Item label="High (80%+)" value="high" />
                <Picker.Item label="Medium (50-80%)" value="medium" />
                <Picker.Item label="Low (<50%)" value="low" />
                <Picker.Item
                  label="Underutilized (<20%)"
                  value="underutilized"
                />
              </Picker>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Copies Count</Text>
              <Picker
                style={styles.picker}
                onValueChange={() => console.log("Copies Count filter changed")}
              >
                <Picker.Item label="All Counts" value="all" />
                <Picker.Item label="Single Copy (1)" value="single" />
                <Picker.Item label="Few Copies (2-5)" value="few" />
                <Picker.Item label="Many Copies (6+)" value="many" />
              </Picker>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Sort By</Text>
              <Picker
                style={styles.picker}
                onValueChange={() => console.log("Sort By filter changed")}
              >
                <Picker.Item label="Book Title" value="title" />
                <Picker.Item label="Total Copies" value="copies" />
                <Picker.Item label="Utilization Rate" value="utilization" />
                <Picker.Item label="Book Value" value="value" />
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={() => console.log("Apply Filters pressed")}
            >
              <Text style={styles.generateButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Book-wise Copy Analysis</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => console.log("Export PDF pressed")}
            >
              <Text style={styles.exportButtonText}>Export PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => console.log("Export Excel pressed")}
            >
              <Text style={styles.exportButtonText}>Export Excel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Book Details
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Subject
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Total Copies
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Available
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Issued</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Utilization
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Book Value
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Total Investment
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Actions
              </Text>
            </View>
            {bookWiseCopiesData.bookAnalysisTable.map((book, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>by {book.author}</Text>
                </View>
                <Text style={styles.tableCell}>{book.subject}</Text>
                <Text style={styles.tableCell}>{book.totalCopies}</Text>
                <Text style={styles.tableCell}>{book.available}</Text>
                <Text style={styles.tableCell}>{book.issued}</Text>
                <Text style={styles.tableCell}>{book.utilization}</Text>
                <Text style={styles.tableCell}>{book.bookValue}</Text>
                <Text style={styles.tableCell}>{book.totalInvestment}</Text>
                <View style={styles.tableCell}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      console.log(`Details pressed for ${book.title}`)
                    }
                  >
                    <Text style={styles.actionButtonText}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      console.log(`Manage pressed for ${book.title}`)
                    }
                  >
                    <Text style={styles.actionButtonText}>Manage</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.tableFooter}>Showing 1-7 of 247 books</Text>
          <View style={styles.pagination}>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationButtonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationButtonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationButtonText}>3</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paginationButton}>
              <Text style={styles.paginationButtonText}>Next</Text>
            </TouchableOpacity>
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
    borderBottomWidth: 2,
    borderBottomColor: "#e9ecef",
    paddingVertical: 16,
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
  backLink: {
    marginBottom: 20,
  },
  backLinkText: {
    color: "#007bff",
    fontSize: 16,
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
  picker: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  generateButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  exportButtonText: {
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
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666",
  },
  actionButton: {
    backgroundColor: "#007bff",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
  tableFooter: {
    marginTop: 10,
    color: "#666",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
  },
  paginationButtonText: {
    color: "#007bff",
  },
});

export default BookWiseCopies;
