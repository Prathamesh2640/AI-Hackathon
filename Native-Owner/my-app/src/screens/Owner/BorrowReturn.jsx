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

const BorrowReturn = () => {
  const navigation = useNavigation();
  const { users, books, borrowBook, returnBook } = useGlobalContext();
  const [borrowUserId, setBorrowUserId] = useState("");
  const [borrowBookId, setBorrowBookId] = useState("");
  const [borrowCopyId, setBorrowCopyId] = useState("");
  const [returnBookId, setReturnBookId] = useState("");
  const [returnCopyId, setReturnCopyId] = useState("");
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateBorrowInputs = () => {
    if (!borrowUserId || !borrowBookId || !borrowCopyId) {
      Alert.alert("Error", "All borrow fields are required");
      return false;
    }
    const user = users.find((u) => u.id === borrowUserId);
    if (!user || user.role !== "member") {
      Alert.alert("Error", "Invalid or non-member user ID");
      return false;
    }
    const book = books.find((b) => b.id === borrowBookId);
    if (!book) {
      Alert.alert("Error", "Invalid book ID");
      return false;
    }
    const copy = book.copies.find((c) => c.id === borrowCopyId);
    if (!copy || copy.status !== "Available") {
      Alert.alert("Error", "Invalid or unavailable copy ID");
      return false;
    }
    return true;
  };

  const handleBorrow = () => {
    if (validateBorrowInputs()) {
      borrowBook(borrowUserId, borrowBookId, borrowCopyId);
      setBorrowUserId("");
      setBorrowBookId("");
      setBorrowCopyId("");
    }
  };

  const validateReturnInputs = () => {
    if (!returnBookId || !returnCopyId) {
      Alert.alert("Error", "All return fields are required");
      return false;
    }
    const book = books.find((b) => b.id === returnBookId);
    if (!book) {
      Alert.alert("Error", "Invalid book ID");
      return false;
    }
    const copy = book.copies.find((c) => c.id === returnCopyId);
    if (!copy || copy.status !== "Issued") {
      Alert.alert("Error", "Invalid or non-issued copy ID");
      return false;
    }
    return true;
  };

  const handleReturn = () => {
    if (validateReturnInputs()) {
      returnBook(returnBookId, returnCopyId);
      setReturnBookId("");
      setReturnCopyId("");
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
          <Text style={styles.panelTitle}>Borrow/Return Books</Text>
          <Text style={styles.panelSubtitle}>
            Manage book borrowing and returning for members
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Issue Book</Text>
          <TextInput
            style={styles.input}
            placeholder="User ID"
            value={borrowUserId}
            onChangeText={setBorrowUserId}
          />
          <TextInput
            style={styles.input}
            placeholder="Book ID"
            value={borrowBookId}
            onChangeText={setBorrowBookId}
          />
          <TextInput
            style={styles.input}
            placeholder="Copy ID"
            value={borrowCopyId}
            onChangeText={setBorrowCopyId}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleBorrow}>
            <Text style={styles.actionButtonText}>Issue Book</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Return Book</Text>
          <TextInput
            style={styles.input}
            placeholder="Book ID"
            value={returnBookId}
            onChangeText={setReturnBookId}
          />
          <TextInput
            style={styles.input}
            placeholder="Copy ID"
            value={returnCopyId}
            onChangeText={setReturnCopyId}
          />
          <TouchableOpacity style={styles.actionButton} onPress={handleReturn}>
            <Text style={styles.actionButtonText}>Return Book</Text>
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

export default BorrowReturn;
