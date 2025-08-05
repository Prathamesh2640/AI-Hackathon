import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import BookListItem from "../../components/BookListItem";
import { Colors, globalStyles } from "../../styles/globalStyles";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const search = setTimeout(() => {
      if (query.length > 2 || query.length === 0) {
        fetchBooks();
      }
    }, 500); // Debounce search
    return () => clearTimeout(search);
  }, [query]);

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/api/member/books/search?query=${query}`);
      setBooks(response.data);
    } catch (err) {
      setError("Failed to fetch books.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Search Books" showBackButton />
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Find Your Next Book</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Search by title, author, or ISBN..."
          value={query}
          onChangeText={setQuery}
        />
        {loading && <ActivityIndicator size="large" style={styles.loader} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        <FlatList
          data={books}
          renderItem={({ item }) => <BookListItem book={item} />}
          keyExtractor={(item) => item.book_id.toString()}
          style={styles.list}
          ListEmptyComponent={() =>
            !loading && <Text style={styles.emptyText}>No books found.</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  loader: { marginTop: 20 },
  list: { marginTop: 20 },
  errorText: { color: Colors.danger, textAlign: "center", marginTop: 10 },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textSecondary,
  },
});

export default BookSearch;
