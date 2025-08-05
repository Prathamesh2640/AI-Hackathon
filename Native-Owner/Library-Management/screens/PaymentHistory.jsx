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

const PaymentHistory = () => {
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

  const paidFines = fines.filter((f) => f.status === "Paid");

  const renderPayment = ({ item }) => {
    const book = books.find((b) => b.id === item.bookId);
    return (
      <View style={styles.paymentItem}>
        <Text style={styles.paymentTitle}>{book.title}</Text>
        <Text style={styles.paymentAuthor}>by {book.author}</Text>
        <View style={styles.paymentDetails}>
          <Text style={styles.detailText}>Copy ID: {item.copyId}</Text>
          <Text style={styles.detailText}>Amount: ₹{item.amount}</Text>
          <Text style={styles.detailText}>Reason: {item.reason}</Text>
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
            onPress={() => navigation.navigate("MemberDashboard")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Payment History</Text>
          <Text style={styles.panelSubtitle}>View your paid fines</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Paid Fines</Text>
          <Text style={styles.panelSubtitle}>
            Showing {paidFines.length} paid fines
          </Text>
          {paidFines.length === 0 ? (
            <Text style={styles.noPaymentsText}>No paid fines recorded</Text>
          ) : (
            <FlatList
              data={paidFines}
              renderItem={renderPayment}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
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
  paymentItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  paymentAuthor: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  paymentDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  noPaymentsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default PaymentHistory;
