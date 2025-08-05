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

const OverdueBooks = () => {
  const navigation = useNavigation();
  const { borrowings, books, payFine, calculateOverdueFines } =
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

  const overdueBooks = borrowings
    .filter((b) => b.status === "Overdue")
    .map((b) => {
      const book = books.find((book) => book.id === b.bookId);
      return {
        ...b,
        title: book.title,
        author: book.author,
        copyId: b.copyId,
        fine: b.fine,
        userId: b.userId,
      };
    });

  const renderOverdueBook = ({ item }) => (
    <View style={styles.overdueItem}>
      <Text style={styles.overdueTitle}>{item.title}</Text>
      <Text style={styles.overdueAuthor}>by {item.author}</Text>
      <View style={styles.overdueDetails}>
        <Text style={styles.detailText}>Copy ID: {item.copyId}</Text>
        <Text style={styles.detailText}>User ID: {item.userId}</Text>
        <Text style={styles.detailText}>Due Date: {item.dueDate}</Text>
        <Text style={styles.detailText}>Fine: ₹{item.fine}</Text>
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => payFine(item.id)}
      >
        <Text style={styles.actionButtonText}>Mark Fine Paid</Text>
      </TouchableOpacity>
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
          <Text style={styles.panelTitle}>Overdue Books</Text>
          <Text style={styles.panelSubtitle}>
            Manage overdue books and fines
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Overdue Books</Text>
          <Text style={styles.panelSubtitle}>
            Showing {overdueBooks.length} overdue books
          </Text>
          {overdueBooks.length === 0 ? (
            <Text style={styles.noOverdueText}>No overdue books</Text>
          ) : (
            <FlatList
              data={overdueBooks}
              renderItem={renderOverdueBook}
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
  overdueItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  overdueTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  overdueAuthor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  overdueDetails: {
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
  noOverdueText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default OverdueBooks;
