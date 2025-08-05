import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const BorrowedBooks = () => {
  const { user } = useContext(AuthContext);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const response = await api.get(
        `/api/member/borrowing-history/${user.id}`
      );
      // Filter for books that have not been returned yet
      const currentLoans = response.data.filter(
        (item) => item.return_date === null
      );
      setBorrowedBooks(currentLoans);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const renderItem = ({ item }) => {
    const isOverdue = new Date(item.due_date) < new Date();
    return (
      <Card style={[styles.bookCard, isOverdue && styles.overdueCard]}>
        <Text style={styles.title}>{item.bookCopy.book.title}</Text>
        <Text style={styles.author}>by {item.bookCopy.book.author}</Text>
        <View style={styles.detailsRow}>
          <Text>Issued: {formatDate(item.issue_date)}</Text>
          <Text style={isOverdue ? styles.overdueText : styles.dueText}>
            Due: {formatDate(item.due_date)}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="My Borrowed Books" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={borrowedBooks}
        renderItem={renderItem}
        keyExtractor={(item) => item.borrowing_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListHeaderComponent={
          <Text style={globalStyles.title}>Currently On Loan</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You have no books currently borrowed.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  bookCard: { marginVertical: 8 },
  overdueCard: { borderColor: Colors.danger, borderWidth: 2 },
  title: { fontSize: 16, fontWeight: "bold" },
  author: {
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginBottom: 10,
  },
  detailsRow: { flexDirection: "row", justifyContent: "space-between" },
  dueText: { fontWeight: "bold" },
  overdueText: { color: Colors.danger, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

export default BorrowedBooks;
