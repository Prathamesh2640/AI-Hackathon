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

const BorrowedBooks = () => {
  const navigation = useNavigation();
  const { borrowings, books, returnBook, calculateOverdueFines } =
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

  const userBorrowings = borrowings.filter((b) => b.status !== "Returned");
  const reminder = userBorrowings.some((b) => b.status === "Overdue")
    ? "You have overdue books! Please return them to avoid additional fines."
    : "Remember to return your books on time to avoid fines.";

  const renderBook = ({ item }) => {
    const book = books.find((b) => b.id === item.bookId);
    return (
      <View style={styles.bookItem}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>by {book.author}</Text>
        <View style={styles.bookDetails}>
          <Text style={styles.detailText}>Status: {item.status}</Text>
          <Text style={styles.detailText}>Due Date: {item.dueDate}</Text>
          <Text style={styles.detailText}>Copy ID: {item.copyId}</Text>
          <Text style={styles.detailText}>Borrowed Date: {item.issueDate}</Text>
          <Text style={styles.detailText}>Fine: ₹{item.fine}</Text>
          <Text style={styles.detailText}>
            Rack Location: {book.copies.find((c) => c.id === item.copyId).rack}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => returnBook(item.bookId, item.copyId)}
        >
          <Text style={styles.actionButtonText}>Return This Book</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
          <Text style={styles.panelTitle}>My Borrowed Books</Text>
          <Text style={styles.panelSubtitle}>
            View all your currently borrowed books and their due dates
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Reminder</Text>
          <Text style={styles.reminderText}>{reminder}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Currently Borrowed Books</Text>
          <Text style={styles.panelSubtitle}>
            Showing {userBorrowings.length} borrowed books
          </Text>
          <FlatList
            data={userBorrowings}
            renderItem={renderBook}
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
  reminderText: {
    fontSize: 16,
    color: "#dc3545",
    fontStyle: "italic",
  },
  bookItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  bookDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
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
});

export default BorrowedBooks;
