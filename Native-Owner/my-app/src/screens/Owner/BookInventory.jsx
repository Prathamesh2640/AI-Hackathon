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

const BookInventory = () => {
  const navigation = useNavigation();
  const { books, borrowings } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const totalTitles = books.length;
  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const issuedCopies = books.reduce(
    (sum, book) => sum + (book.totalCopies - book.availableCopies),
    0
  );
  const utilizationRate =
    totalCopies > 0 ? ((issuedCopies / totalCopies) * 100).toFixed(2) : 0;
  const totalInvestment = books.reduce(
    (sum, book) =>
      sum + parseFloat(book.price.replace("₹", "")) * book.totalCopies,
    0
  );

  const categories = [...new Set(books.map((book) => book.subject))].map(
    (subject) => {
      const categoryBooks = books.filter((b) => b.subject === subject);
      const categoryCopies = categoryBooks.reduce(
        (sum, b) => sum + b.totalCopies,
        0
      );
      const categoryIssued = categoryBooks.reduce(
        (sum, b) => sum + (b.totalCopies - b.availableCopies),
        0
      );
      const categoryInvestment = categoryBooks.reduce(
        (sum, b) => sum + parseFloat(b.price.replace("₹", "")) * b.totalCopies,
        0
      );
      return {
        subject,
        titles: categoryBooks.length,
        copies: categoryCopies,
        utilizationRate:
          categoryCopies > 0
            ? ((categoryIssued / categoryCopies) * 100).toFixed(2)
            : 0,
        avgPrice:
          categoryCopies > 0
            ? (categoryInvestment / categoryCopies).toFixed(2)
            : 0,
      };
    }
  );

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>by {item.author}</Text>
      <View style={styles.bookDetails}>
        <Text style={styles.detailText}>Subject: {item.subject}</Text>
        <Text style={styles.detailText}>Total Copies: {item.totalCopies}</Text>
        <Text style={styles.detailText}>
          Available Copies: {item.availableCopies}
        </Text>
        <Text style={styles.detailText}>Price: {item.price}</Text>
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
          <Text style={styles.panelTitle}>Book Inventory</Text>
          <Text style={styles.panelSubtitle}>
            Overview of library book collection
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Inventory Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{totalTitles}</Text>
              <Text style={styles.kpiLabel}>Total Titles</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{totalCopies}</Text>
              <Text style={styles.kpiLabel}>Total Copies</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{utilizationRate}%</Text>
              <Text style={styles.kpiLabel}>Utilization Rate</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                ₹{totalInvestment.toFixed(2)}
              </Text>
              <Text style={styles.kpiLabel}>Total Investment</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>By Category</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Subject
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Titles</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Copies</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Utilization
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Avg Price
              </Text>
            </View>
            {categories.map((cat, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{cat.subject}</Text>
                <Text style={styles.tableCell}>{cat.titles}</Text>
                <Text style={styles.tableCell}>{cat.copies}</Text>
                <Text style={styles.tableCell}>{cat.utilizationRate}%</Text>
                <Text style={styles.tableCell}>₹{cat.avgPrice}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>All Books</Text>
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
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  kpiCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width / 2 - 30,
    minWidth: 150,
  },
  kpiNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  kpiLabel: {
    color: "#666",
    fontSize: 14,
    textTransform: "uppercase",
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    paddingVertical: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f8f9fa",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 5,
    fontSize: 14,
    color: "#666",
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
});

export default BookInventory;
