import React, { useState } from "react";
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
import { availableCopiesData } from "../../utils/dummyMemberData";

const { width } = Dimensions.get("window");

const AvailableCopies = () => {
  const navigation = useNavigation();
  const [copyFilter, setCopyFilter] = useState("All Copies");
  const [rackFilter, setRackFilter] = useState("All Racks");

  const filteredCopies = availableCopiesData.copies.filter((copy) => {
    const matchesCopyFilter =
      copyFilter === "All Copies" ||
      (copyFilter === "Available Only" && copy.status === "Available") ||
      (copyFilter === "Issued Only" && copy.status === "Issued");
    const matchesRackFilter =
      rackFilter === "All Racks" || copy.rackLocation === rackFilter;
    return matchesCopyFilter && matchesRackFilter;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BookDetails")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Book Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.bookTitle}>{availableCopiesData.title}</Text>
          <Text style={styles.bookAuthor}>by {availableCopiesData.author}</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {availableCopiesData.totalCopies}
              </Text>
              <Text style={styles.summaryLabel}>Total Copies</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {availableCopiesData.available}
              </Text>
              <Text style={styles.summaryLabel}>Available</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {availableCopiesData.issued}
              </Text>
              <Text style={styles.summaryLabel}>Currently Issued</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {availableCopiesData.price}
              </Text>
              <Text style={styles.summaryLabel}>Book Price</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>All Copies</Text>
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Filter by:</Text>
              <Picker
                style={styles.picker}
                selectedValue={copyFilter}
                onValueChange={(value) => setCopyFilter(value)}
              >
                <Picker.Item label="All Copies" value="All Copies" />
                <Picker.Item label="Available Only" value="Available Only" />
                <Picker.Item label="Issued Only" value="Issued Only" />
              </Picker>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Rack Location:</Text>
              <Picker
                style={styles.picker}
                selectedValue={rackFilter}
                onValueChange={(value) => setRackFilter(value)}
              >
                <Picker.Item label="All Racks" value="All Racks" />
                <Picker.Item label="Rack 1" value="Rack 1" />
                <Picker.Item label="Rack 2" value="Rack 2" />
                <Picker.Item label="Rack 3" value="Rack 3" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          {filteredCopies.map((copy, index) => (
            <View key={index} style={styles.copyItem}>
              <Text style={styles.copyId}>Copy {copy.id}</Text>
              <Text style={styles.copyStatus}>{copy.status}</Text>
              <View style={styles.copyDetails}>
                <Text style={styles.copyDetail}>
                  Rack Location: {copy.rackLocation}
                </Text>
                <Text style={styles.copyDetail}>
                  Condition: {copy.condition}
                </Text>
                {copy.status === "Available" ? (
                  <>
                    <Text style={styles.copyDetail}>
                      Added Date: {copy.addedDate}
                    </Text>
                    <Text style={styles.copyDetail}>
                      Last Borrowed: {copy.lastBorrowed}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.copyDetail}>
                      Issued To: {copy.issuedTo}
                    </Text>
                    <Text style={styles.copyDetail}>
                      Due Date: {copy.dueDate}
                    </Text>
                    {copy.overdue && (
                      <Text style={styles.copyOverdue}>
                        Overdue by {copy.overdue}
                      </Text>
                    )}
                  </>
                )}
              </View>
              {copy.status === "Available" ? (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => console.log(`Borrow copy: ${copy.id}`)}
                >
                  <Text style={styles.actionButtonText}>Borrow This Copy</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.unavailableText}>
                  This copy is {copy.overdue ? "overdue" : "currently borrowed"}{" "}
                  and will be available after return.
                </Text>
              )}
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
  bookTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 18,
    color: "#666",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  summaryItem: {
    width: width / 2 - 30,
    minWidth: 150,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
  },
  panelTitle: {
    color: "#333",
    fontSize: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
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
  copyItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  copyId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  copyStatus: {
    fontSize: 14,
    color: "#28a745",
    marginBottom: 5,
  },
  copyDetails: {
    marginBottom: 10,
  },
  copyDetail: {
    fontSize: 14,
    color: "#666",
  },
  copyOverdue: {
    fontSize: 14,
    color: "#dc3545",
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  unavailableText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});

export default AvailableCopies;
