import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const FinancialReports = () => {
  const navigation = useNavigation();
  const { fines, books } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const totalRevenue = fines.reduce(
    (sum, fine) => sum + (fine.status === "Paid" ? fine.amount : 0),
    0
  );
  const outstandingFines = fines.reduce(
    (sum, fine) => sum + (fine.status === "Unpaid" ? fine.amount : 0),
    0
  );

  const renderFine = ({ item }) => {
    const book = books.find((b) => b.id === item.bookId);
    return (
      <View style={styles.fineItem}>
        <Text style={styles.fineTitle}>{book.title}</Text>
        <Text style={styles.fineAuthor}>by {book.author}</Text>
        <View style={styles.fineDetails}>
          <Text style={styles.detailText}>User ID: {item.userId}</Text>
          <Text style={styles.detailText}>Copy ID: {item.copyId}</Text>
          <Text style={styles.detailText}>Amount: ₹{item.amount}</Text>
          <Text style={styles.detailText}>Status: {item.status}</Text>
          <Text style={styles.detailText}>Date: {item.date}</Text>
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
          <Text style={styles.panelTitle}>Financial Reports</Text>
          <Text style={styles.panelSubtitle}>View financial performance</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{totalRevenue}</Text>
              <Text style={styles.kpiLabel}>Total Revenue</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>₹{outstandingFines}</Text>
              <Text style={styles.kpiLabel}>Outstanding Fines</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Fine Records</Text>
          <Text style={styles.panelSubtitle}>
            Showing {fines.length} fine records
          </Text>
          <FlatList
            data={fines}
            renderItem={renderFine}
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
  fineItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  fineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  fineAuthor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  fineDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
});

export default FinancialReports;
