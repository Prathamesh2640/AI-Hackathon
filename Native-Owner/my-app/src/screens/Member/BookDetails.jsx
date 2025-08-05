import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { bookDetailsData } from "../../utils/dummyMemberData";

const { width } = Dimensions.get("window");

const BookDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params || {};

  // In a real app, fetch book data by bookId; here we use static data
  const book = bookDetailsData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BookSearch")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <Text style={styles.availability}>{book.availability}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Book Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ISBN</Text>
              <Text style={styles.infoValue}>{book.isbn}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Subject</Text>
              <Text style={styles.infoValue}>{book.subject}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>{book.price}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Total Copies</Text>
              <Text style={styles.infoValue}>{book.totalCopies}</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Description</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Quick Actions</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log(`Borrow book: ${book.title}`)}
            >
              <Text style={styles.actionButtonText}>Borrow This Book</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("AvailableCopies")}
            >
              <Text style={styles.actionButtonText}>View All Copies</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Available Copies</Text>
          {book.availableCopies.map((copy, index) => (
            <View key={index} style={styles.copyItem}>
              <Text style={styles.copyId}>{copy.id}</Text>
              <Text style={styles.copyStatus}>{copy.status}</Text>
              <Text style={styles.copyDetail}>Rack: {copy.rack}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Related Books</Text>
          {book.relatedBooks.map((relatedBook, index) => (
            <View key={index} style={styles.relatedBookItem}>
              <Text style={styles.relatedBookText}>{relatedBook}</Text>
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
    marginBottom: 5,
  },
  availability: {
    fontSize: 16,
    color: "#28a745",
  },
  panelTitle: {
    color: "#333",
    fontSize: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoItem: {
    width: width / 2 - 30,
    minWidth: 150,
  },
  infoLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
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
  copyItem: {
    paddingVertical: 10,
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
  },
  copyDetail: {
    fontSize: 14,
    color: "#666",
  },
  relatedBookItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  relatedBookText: {
    fontSize: 16,
    color: "#666",
  },
});

export default BookDetails;
