import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const BorrowReturn = () => {
  const navigation = useNavigation();
  const {
    books,
    users,
    borrowings,
    borrowBook,
    returnBook,
    calculateOverdueFines,
  } = useGlobalContext();
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [copyId, setCopyId] = useState("");
  const [action, setAction] = useState("borrow");
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    calculateOverdueFines();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBorrowOrReturn = () => {
    if (!userId || !bookId || !copyId) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const user = users.find(
      (u) => u.id === userId && u.role === "member" && u.isPaid
    );
    if (!user) {
      Alert.alert("Error", "Invalid or unpaid user");
      return;
    }
    const book = books.find((b) => b.id === bookId);
    if (!book) {
      Alert.alert("Error", "Invalid book ID");
      return;
    }
    const copy = book.copies.find((c) => c.id === copyId);
    if (!copy) {
      Alert.alert("Error", "Invalid copy ID");
      return;
    }
    if (action === "borrow") {
      if (book.availableCopies === 0) {
        Alert.alert("Error", "No copies available");
        return;
      }
      borrowBook(userId, bookId, copyId);
      Alert.alert("Success", "Book borrowed successfully");
    } else {
      const borrowing = borrowings.find(
        (b) =>
          b.userId === userId &&
          b.bookId === bookId &&
          b.copyId === copyId &&
          b.status !== "Returned"
      );
      if (!borrowing) {
        Alert.alert("Error", "No active borrowing found");
        return;
      }
      returnBook(borrowing.id);
      Alert.alert("Success", "Book returned successfully");
    }
    setUserId("");
    setBookId("");
    setCopyId("");
  };

  const renderBorrowing = ({ item }) => {
    const book = books.find((b) => b.id === item.bookId);
    const user = users.find((u) => u.id === item.userId);
    return (
      <View style={styles.borrowingItem}>
        <Text style={styles.borrowingTitle}>{book.title}</Text>
        <Text style={styles.borrowingAuthor}>by {book.author}</Text>
        <View style={styles.borrowingDetails}>
          <Text style={styles.detailText}>User: {user.email}</Text>
          <Text style={styles.detailText}>Copy ID: {item.copyId}</Text>
          <Text style={styles.detailText}>Issue Date: {item.issueDate}</Text>
          <Text style={styles.detailText}>Due Date: {item.dueDate}</Text>
          <Text style={styles.detailText}>Status: {item.status}</Text>
          {item.fine > 0 && (
            <Text style={styles.detailText}>Fine: ₹{item.fine}</Text>
          )}
        </View>
      </View>
    );
  };

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
          <Text style={styles.panelTitle}>Borrow/Return Books</Text>
          <Text style={styles.panelSubtitle}>
            Manage book borrowing and returning
          </Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                action === "borrow" ? styles.toggleButtonActive : {},
              ]}
              onPress={() => setAction("borrow")}
            >
              <Text style={styles.toggleButtonText}>Borrow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                action === "return" ? styles.toggleButtonActive : {},
              ]}
              onPress={() => setAction("return")}
            >
              <Text style={styles.toggleButtonText}>Return</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="User ID"
            value={userId}
            onChangeText={setUserId}
          />
          <TextInput
            style={styles.input}
            placeholder="Book ID"
            value={bookId}
            onChangeText={setBookId}
          />
          <TextInput
            style={styles.input}
            placeholder="Copy ID"
            value={copyId}
            onChangeText={setCopyId}
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBorrowOrReturn}
          >
            <Text style={styles.actionButtonText}>
              {action === "borrow" ? "Borrow Book" : "Return Book"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Current Borrowings</Text>
          <Text style={styles.panelSubtitle}>
            Showing {borrowings.filter((b) => b.status !== "Returned").length}{" "}
            active borrowings
          </Text>
          <FlatList
            data={borrowings.filter((b) => b.status !== "Returned")}
            renderItem={renderBorrowing}
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
  toggleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#007bff",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
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
});

export default BorrowReturn;
