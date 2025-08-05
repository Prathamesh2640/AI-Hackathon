import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const BookDetails = ({ navigation }) => {
  const route = useRoute();
  const { bookId } = route.params;
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // We will get all books and find the one we need.
      // In a production app, you'd have a dedicated endpoint like `/api/member/books/:bookId`
      const response = await api.get(`/api/member/books/search?query=`);
      const foundBook = response.data.find((b) => b.book_id === bookId);
      setBook(foundBook);
    } catch (error) {
      console.error("Failed to fetch book details:", error);
      Alert.alert("Error", "Could not load book details.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [bookId])
  );

  const handleBorrow = async () => {
    if (!book) return;
    const availableCopies = book.copies.filter((c) => c.status === "Available");
    if (!user.is_paid_member) {
      Alert.alert(
        "Membership Inactive",
        "Please contact the librarian to activate your membership before borrowing."
      );
      return;
    }
    if (availableCopies.length === 0) {
      Alert.alert(
        "Unavailable",
        "No copies of this book are currently available."
      );
      return;
    }

    setBorrowing(true);
    try {
      // Borrow the first available copy
      const firstAvailableCopyId = availableCopies[0].copy_id;
      const response = await api.post(
        `/api/member/borrow/${firstAvailableCopyId}`
      );

      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => navigation.navigate("BorrowedBooks") },
      ]);
      fetchData(); // Refresh book details to show one less copy
    } catch (error) {
      Alert.alert(
        "Borrow Failed",
        error.response?.data?.message || "An error occurred."
      );
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.flexOne}>
        <CustomHeader title="Book Details" showBackButton />
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.flexOne}>
        <CustomHeader title="Book Details" showBackButton />
        <Text style={styles.centeredText}>Book not found.</Text>
      </View>
    );
  }

  const availableCopiesCount = book.copies.filter(
    (c) => c.status === "Available"
  ).length;

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Book Details" showBackButton />
      <ScrollView style={globalStyles.container}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>by {book.author}</Text>
        <Text
          style={[
            styles.availability,
            {
              color: availableCopiesCount > 0 ? Colors.success : Colors.danger,
            },
          ]}
        >
          {availableCopiesCount}{" "}
          {availableCopiesCount === 1 ? "Copy" : "Copies"} Available
        </Text>

        <TouchableOpacity
          style={[
            globalStyles.button,
            (borrowing || availableCopiesCount === 0) && styles.disabledButton,
          ]}
          onPress={handleBorrow}
          disabled={borrowing || availableCopiesCount === 0}
        >
          {borrowing ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>
              Borrow First Available Copy
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonSecondary,
            { marginTop: 10, marginBottom: 20 },
          ]}
          onPress={() => navigation.navigate("AvailableCopies", { book: book })}
        >
          <Text
            style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}
          >
            View All {book.copies.length} Copies
          </Text>
        </TouchableOpacity>

        <Card>
          <Text style={styles.detailLabel}>ISBN</Text>
          <Text style={styles.detailValue}>{book.isbn || "N/A"}</Text>
          <Text style={styles.detailLabel}>Publication Year</Text>
          <Text style={styles.detailValue}>
            {book.publication_year || "N/A"}
          </Text>
          <Text style={styles.detailLabel}>Average Value</Text>
          <Text style={styles.detailValue}>
            ₹{book.average_value?.toLocaleString()}
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  centeredText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: Colors.textSecondary,
  },
  bookTitle: { fontSize: 28, fontWeight: "bold" },
  bookAuthor: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginBottom: 10,
  },
  availability: { fontSize: 16, fontWeight: "bold", marginBottom: 20 },
  disabledButton: { backgroundColor: Colors.textSecondary },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 15,
    textTransform: "uppercase",
  },
  detailValue: { fontSize: 16, fontWeight: "500", marginBottom: 5 },
});

export default BookDetails;
