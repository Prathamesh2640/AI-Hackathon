import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const BookManagement = () => {
  const navigation = useNavigation();
  const { addBook, addCopy, books } = useGlobalContext();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [subject, setSubject] = useState("");
  const [price, setPrice] = useState("");
  const [bookId, setBookId] = useState("");
  const [copyRack, setCopyRack] = useState("");
  const [copyCondition, setCopyCondition] = useState("");
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateBookInputs = () => {
    if (!title || !author || !isbn || !subject || !price) {
      Alert.alert("Error", "All book fields are required");
      return false;
    }
    if (!/^\d{10,13}$/.test(isbn)) {
      Alert.alert("Error", "ISBN must be 10 or 13 digits");
      return false;
    }
    if (!/₹?\d+(\.\d{2})?/.test(price)) {
      Alert.alert(
        "Error",
        "Price must be a valid amount (e.g., ₹100 or 100.00)"
      );
      return false;
    }
    return true;
  };

  const handleAddBook = () => {
    if (validateBookInputs()) {
      addBook({
        title,
        author,
        isbn,
        subject,
        price: `₹${parseFloat(price).toFixed(2)}`,
        totalCopies: 0,
      });
      setTitle("");
      setAuthor("");
      setIsbn("");
      setSubject("");
      setPrice("");
    }
  };

  const validateCopyInputs = () => {
    if (!bookId || !copyRack || !copyCondition) {
      Alert.alert("Error", "All copy fields are required");
      return false;
    }
    if (!books.find((b) => b.id === bookId)) {
      Alert.alert("Error", "Invalid Book ID");
      return false;
    }
    return true;
  };

  const handleAddCopy = () => {
    if (validateCopyInputs()) {
      addCopy(bookId, {
        rack: copyRack,
        condition: copyCondition,
        addedDate: new Date().toISOString().split("T")[0],
        lastBorrowed: null,
      });
      setBookId("");
      setCopyRack("");
      setCopyCondition("");
    }
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
          <Text style={styles.panelTitle}>Book Management</Text>
          <Text style={styles.panelSubtitle}>
            Add new book titles and copies to the library
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Add New Book</Text>
          <TextInput
            style={styles.input}
            placeholder="Book Title"
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
            placeholder="ISBN"
            value={isbn}
            onChangeText={setIsbn}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={styles.input}
            placeholder="Price (₹)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleAddBook}>
            <Text style={styles.actionButtonText}>Add Book</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Add Book Copy</Text>
          <TextInput
            style={styles.input}
            placeholder="Book ID"
            value={bookId}
            onChangeText={setBookId}
          />
          <TextInput
            style={styles.input}
            placeholder="Rack Location (e.g., Rack 1)"
            value={copyRack}
            onChangeText={setCopyRack}
          />
          <TextInput
            style={styles.input}
            placeholder="Condition (e.g., Good, Excellent)"
            value={copyCondition}
            onChangeText={setCopyCondition}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleAddCopy}>
            <Text style={styles.actionButtonText}>Add Copy</Text>
          </TouchableOpacity>
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

export default BookManagement;
