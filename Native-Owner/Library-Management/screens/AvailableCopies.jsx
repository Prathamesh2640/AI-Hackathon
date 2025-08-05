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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const AvailableCopies = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params;
  const { books } = useGlobalContext();
  const book = books.find((b) => b.id === bookId);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Book not found</Text>
      </View>
    );
  }

  const availableCopies = book.copies.filter((c) => c.status === "Available");

  const renderCopy = ({ item }) => (
    <View style={styles.copyItem}>
      <Text style={styles.copyText}>Copy ID: {item.id}</Text>
      <Text style={styles.copyText}>Rack: {item.rack}</Text>
      <Text style={styles.copyText}>Condition: {item.condition}</Text>
      <Text style={styles.copyText}>
        Last Borrowed: {item.lastBorrowed || "Never"}
      </Text>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("BookDetails", { bookId })}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Book Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{book.title}</Text>
          <Text style={styles.panelSubtitle}>Available Copies</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Available Copies</Text>
          <Text style={styles.panelSubtitle}>
            Showing {availableCopies.length} available copies
          </Text>
          {availableCopies.length === 0 ? (
            <Text style={styles.noCopiesText}>No available copies</Text>
          ) : (
            <FlatList
              data={availableCopies}
              renderItem={renderCopy}
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
  copyItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  copyText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  noCopiesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#dc3545",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AvailableCopies;
