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

const AssetReports = () => {
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

  const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const totalAssetValue = books.reduce(
    (sum, book) =>
      sum + parseFloat(book.price.replace("₹", "")) * book.totalCopies,
    0
  );
  const utilizationRate =
    totalBooks > 0
      ? (
          (borrowings.filter((b) => b.status !== "Returned").length /
            totalBooks) *
          100
        ).toFixed(2)
      : 0;
  const categories = [...new Set(books.map((book) => book.subject))].map(
    (subject) => {
      const categoryBooks = books.filter((b) => b.subject === subject);
      const categoryCopies = categoryBooks.reduce(
        (sum, b) => sum + b.totalCopies,
        0
      );
      const categoryValue = categoryBooks.reduce(
        (sum, b) => sum + parseFloat(b.price.replace("₹", "")) * b.totalCopies,
        0
      );
      return {
        subject,
        copies: categoryCopies,
        value: categoryValue,
        utilizationRate:
          categoryCopies > 0
            ? (
                (categoryBooks.reduce(
                  (sum, b) => sum + (b.totalCopies - b.availableCopies),
                  0
                ) /
                  categoryCopies) *
                100
              ).toFixed(2)
            : 0,
      };
    }
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item.subject}</Text>
      <Text style={styles.categoryText}>{item.copies} Copies</Text>
      <Text style={styles.categoryText}>₹{item.value.toFixed(2)}</Text>
      <Text style={styles.categoryText}>{item.utilizationRate}%</Text>
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
          <Text style={styles.panelTitle}>Asset Reports</Text>
          <Text style={styles.panelSubtitle}>
            Overview of library assets and their value
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Asset Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                ₹{totalAssetValue.toFixed(2)}
              </Text>
              <Text style={styles.kpiLabel}>Total Asset Value</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{totalBooks}</Text>
              <Text style={styles.kpiLabel}>Total Books</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{utilizationRate}%</Text>
              <Text style={styles.kpiLabel}>Utilization Rate</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Asset Valuation by Category</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Category
              </Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Copies</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Value</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Utilization
              </Text>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.subject}
              showsVerticalScrollIndicator={false}
            />
          </View>
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
  categoryItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  categoryText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
});

export default AssetReports;
