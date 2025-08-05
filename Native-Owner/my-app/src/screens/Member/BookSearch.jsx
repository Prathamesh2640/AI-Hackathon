import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const BookSearch = () => {
  const navigation = useNavigation();
  const { books, borrowBook, users } = useGlobalContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Subjects");
  const [availabilityFilter, setAvailabilityFilter] = useState("All Books");
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const subjects = [
    "All Subjects",
    ...new Set(books.map((book) => book.subject)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesSubject =
      subjectFilter === "All Subjects" || book.subject === subjectFilter;
    const matchesAvailability =
      availabilityFilter === "All Books" ||
      (availabilityFilter === "Available Only" && book.availableCopies > 0);
    return matchesSearch && matchesSubject && matchesAvailability;
  });

  const handleBorrow = (bookId) => {
    const user = users.find((u) => u.role === "member" && u.isPaid); // Simulate logged-in member
    if (!user) return;
    const book = books.find((b) => b.id === bookId);
    const availableCopy = book.copies.find((c) => c.status === "Available");
    if (availableCopy) {
      borrowBook(user.id, bookId, availableCopy.id);
    }
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <View style={styles.bookDetails}>
        <Text style={styles.detailText}>Subject: {item.subject}</Text>
        <Text style={styles.detailText}>ISBN: {item.isbn}</Text>
        <Text style={styles.detailText}>Price: {item.price}</Text>
        <Text style={styles.detailText}>
          {item.availableCopies > 0
            ? `${item.availableCopies} copies available`
            : "Currently unavailable"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("BookDetails", { bookId: item.id })
          }
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        {item.availableCopies > 0 && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleBorrow(item.id)}
          >
            <Text style={styles.actionButtonText}>Borrow</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
          <Text style={styles.panelTitle}>Search Books</Text>
          <Text style={styles.panelSubtitle}>
            Find your next favorite book from our extensive collection
          </Text>
        </View>

        <View style={styles.panel}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Title, Author, or ISBN"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterContainer}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Subject</Text>
              <Picker
                style={styles.picker}
                selectedValue={subjectFilter}
                onValueChange={(value) => setSubjectFilter(value)}
              >
                {subjects.map((subject, index) => (
                  <Picker.Item key={index} label={subject} value={subject} />
                ))}
              </Picker>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Availability</Text>
              <Picker
                style={styles.picker}
                selectedValue={availabilityFilter}
                onValueChange={(value) => setAvailabilityFilter(value)}
              >
                <Picker.Item label="All Books" value="All Books" />
                <Picker.Item label="Available Only" value="Available Only" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Search Results</Text>
          <Text style={styles.panelSubtitle}>
            Found {filteredBooks.length} books matching your criteria
          </Text>
          <FlatList
            data={filteredBooks}
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
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterItem: {
    flex: 1,
    minWidth: 150,
  },
  filterLabel: {
    color: "#333",
    fontSize: 14,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
    backgroundColor: "#fff",
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
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BookSearch;
