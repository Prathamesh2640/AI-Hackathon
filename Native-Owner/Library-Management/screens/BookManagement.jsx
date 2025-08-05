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

const BookManagement = () => {
  const navigation = useNavigation();
  const { books, addBook, updateBook, deleteBook } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [isbn, setIsbn] = useState("");
  const [price, setPrice] = useState("");
  const [copies, setCopies] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddOrUpdateBook = () => {
    if (!title || !author || !subject || !isbn || !price || !copies) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    const copiesNum = parseInt(copies);
    if (isNaN(copiesNum) || copiesNum <= 0) {
      Alert.alert("Error", "Please enter a valid number of copies");
      return;
    }
    const bookData = {
      title,
      author,
      subject,
      isbn,
      price: `₹${parseFloat(price).toFixed(2)}`,
      totalCopies: copiesNum,
      availableCopies: copiesNum,
      copies: Array.from({ length: copiesNum }, (_, i) => ({
        id: `${isbn}-${i + 1}`,
        condition: "Good",
      })),
    };
    if (editingBookId) {
      updateBook(editingBookId, bookData);
      Alert.alert("Success", "Book updated successfully");
      setEditingBookId(null);
    } else {
      addBook(bookData);
      Alert.alert("Success", "Book added successfully");
    }
    setTitle("");
    setAuthor("");
    setSubject("");
    setIsbn("");
    setPrice("");
    setCopies("");
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setSubject(book.subject);
    setIsbn(book.isbn);
    setPrice(book.price.replace("₹", ""));
    setCopies(book.totalCopies.toString());
  };

  const handleDeleteBook = (bookId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteBook(bookId);
            Alert.alert("Success", "Book deleted successfully");
          },
        },
      ]
    );
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <View style={styles.bookDetails}>
        <Text style={styles.detailText}>Subject: {item.subject}</Text>
        <Text style={styles.detailText}>ISBN: {item.isbn}</Text>
        <Text style={styles.detailText}>Total Copies: {item.totalCopies}</Text>
        <Text style={styles.detailText}>
          Available Copies: {item.availableCopies}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditBook(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteBook(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
          <Text style={styles.panelTitle}>
            {editingBookId ? "Edit Book" : "Add New Book"}
          </Text>
          <Text style={styles.panelSubtitle}>
            Manage the library's book collection
          </Text>
        </View>

        <View style={styles.panel}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Author"
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={styles.input}
            placeholder="ISBN"
            value={isbn}
            onChangeText={setIsbn}
          />
          <TextInput
            style={styles.input}
            placeholder="Price (₹)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Copies"
            value={copies}
            onChangeText={setCopies}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddOrUpdateBook}
          >
            <Text style={styles.actionButtonText}>
              {editingBookId ? "Update Book" : "Add Book"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Existing Books</Text>
          <Text style={styles.panelSubtitle}>Showing {books.length} books</Text>
          <FlatList
            data={books}
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
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  editButton: {
    backgroundColor: "#28a745",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BookManagement;
