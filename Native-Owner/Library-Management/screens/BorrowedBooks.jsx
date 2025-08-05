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
  const { borrowings, books } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const currentBorrowings = borrowings.filter((b) => b.status !== "Returned");

  const renderBorrowing = ({ item }) => {
    const book = books.find((b) => b.id === item.bookId);
    return (
      <View style={styles.borrowingItem}>
        <Text style={styles.borrowingTitle}>{book.title}</Text>
        <Text style={styles.borrowingAuthor}>by {book.author}</Text>
        <View style={styles.borrowingDetails}>
          <Text style={styles.detailText}>Copy ID: {item.copyId}</Text>
          <Text style={styles.detailText}>Issue Date: {item.issueDate}</Text>
          <Text style={styles.detailText}>Due Date: {item.dueDate}</Text>
          <Text style={styles.detailText}>Status: {item.status}</Text>
          {item.fine > 0 && (
            <Text style={styles.detailText}>Fine: ₹{item.fine}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("BookDetails", { bookId: item.bookId })
          }
        >
          <Text style={styles.actionButtonText}>View Book Details</Text>
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
            View your currently borrowed books
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Borrowed Books</Text>
          <Text style={styles.panelSubtitle}>
            Showing {currentBorrowings.length} active borrowings
          </Text>
          {currentBorrowings.length === 0 ? (
            <Text style={styles.noBooksText}>No books currently borrowed</Text>
          ) : (
            <FlatList
              data={currentBorrowings}
              renderItem={renderBorrowing}
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
  borrowingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  borrowingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  borrowingAuthor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  borrowingDetails: {
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
  noBooksText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default BorrowedBooks;
