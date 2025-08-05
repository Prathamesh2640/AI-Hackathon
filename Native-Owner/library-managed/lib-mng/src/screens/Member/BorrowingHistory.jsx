import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const BorrowingHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const response = await api.get(
        `/api/member/borrowing-history/${user.id}`
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch borrowing history:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const renderItem = ({ item }) => (
    <Card style={styles.historyCard}>
      <Text style={styles.title}>{item.bookCopy.book.title}</Text>
      <View style={styles.datesContainer}>
        <Text>Issued: {formatDate(item.issue_date)}</Text>
        <Text>Returned: {formatDate(item.return_date)}</Text>
      </View>
      {item.fine_amount > 0 && (
        <Text style={styles.fineText}>Fine Paid: ₹{item.fine_amount}</Text>
      )}
    </Card>
  );

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Borrowing History" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.borrowing_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListHeaderComponent={
          <Text style={globalStyles.title}>Complete Loan History</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have no borrowing history.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  historyCard: { marginVertical: 8 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  fineText: { color: Colors.warning, fontWeight: "bold", marginTop: 5 },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

export default BorrowingHistory;
