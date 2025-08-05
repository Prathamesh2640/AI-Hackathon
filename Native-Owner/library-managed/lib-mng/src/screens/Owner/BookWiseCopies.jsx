import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const BookWiseCopies = () => {
  const [report, setReport] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/owner/reports/book-wise-copies");
      setReport(response.data);
    } catch (error) {
      console.error("Failed to fetch book-wise report:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.bookCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>by {item.author}</Text>
      <View style={styles.statsContainer}>
        <Text>Total: {item.total_copies}</Text>
        <Text style={{ color: Colors.success }}>
          Available: {item.available_copies}
        </Text>
        <Text style={{ color: Colors.danger }}>
          Issued: {item.issued_copies}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Book-wise Copies" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={report}
        renderItem={renderItem}
        keyExtractor={(item) => item.book_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListHeaderComponent={
          <Text style={globalStyles.title}>Book Copy Distribution</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  bookCard: { marginVertical: 8 },
  title: { fontSize: 16, fontWeight: "bold" },
  author: {
    fontSize: 14,
    fontStyle: "italic",
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  statsContainer: { flexDirection: "row", justifyContent: "space-around" },
});

export default BookWiseCopies;
