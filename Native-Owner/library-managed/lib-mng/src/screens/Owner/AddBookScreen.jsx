import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";

const AddBookScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [avgValue, setAvgValue] = useState("");
  const [copyIdentifier, setCopyIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBook = async () => {
    if (!title || !author || !copyIdentifier) {
      Alert.alert(
        "Input Error",
        "Title, Author, and Copy Identifier are required."
      );
      return;
    }
    setLoading(true);
    try {
      // Step 1: Add the book title
      const bookResponse = await api.post("/api/owner/books", {
        title,
        author,
        isbn,
        average_value: parseFloat(avgValue) || 0,
        category_id: 1, // Placeholder, ideally a picker
        publication_year: new Date().getFullYear(), // Placeholder
      });
      const newBookId = bookResponse.data.book_id;

      // Step 2: Add the first copy
      await api.post("/api/owner/book-copies", {
        book_id: newBookId,
        copy_identifier: copyIdentifier,
        rack_id: 1, // Placeholder, ideally a picker
      });

      Alert.alert("Success", "Book and its first copy have been added.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Failed to add book:", error.response?.data || error);
      Alert.alert("Error", "Could not add the book. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Add New Book" showBackButton />
      <ScrollView style={globalStyles.container}>
        <Text style={globalStyles.title}>Book Details</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Book Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[globalStyles.input, styles.mt]}
          placeholder="Author"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={[globalStyles.input, styles.mt]}
          placeholder="ISBN (Optional)"
          value={isbn}
          onChangeText={setIsbn}
        />
        <TextInput
          style={[globalStyles.input, styles.mt]}
          placeholder="Average Value (e.g., 1500.00)"
          value={avgValue}
          onChangeText={setAvgValue}
          keyboardType="numeric"
        />

        <Text style={[globalStyles.sectionTitle, styles.mt]}>
          First Copy Details
        </Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Copy Identifier (e.g., CC-004)"
          value={copyIdentifier}
          onChangeText={setCopyIdentifier}
        />

        <TouchableOpacity
          style={[globalStyles.button, styles.mt]}
          onPress={handleAddBook}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? "Adding..." : "Add Book & Copy"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  mt: { marginTop: 15 },
});

export default AddBookScreen;
