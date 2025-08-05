import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const SubjectWiseInventory = () => {
  const [report, setReport] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // This endpoint doesn't exist yet in the controller, so we'll use asset-breakdown as a placeholder
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/owner/reports/asset-breakdown"); // Using asset-breakdown as a proxy
      setReport(response.data);
    } catch (error) {
      console.error("Failed to fetch subject-wise report:", error);
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
    <Card style={styles.subjectCard}>
      <Text style={styles.title}>{item.category_name}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statText}>Books: {item.book_count}</Text>
        <Text style={styles.statText}>
          Value: ₹{parseInt(item.total_value).toLocaleString()}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Subject Inventory" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={report}
        renderItem={renderItem}
        keyExtractor={(item) => item.category_name}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListHeaderComponent={
          <Text style={globalStyles.title}>Inventory by Subject</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  subjectCard: { marginVertical: 8 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: 10,
  },
  statText: {
    fontSize: 16,
    color: Colors.text,
  },
});

export default SubjectWiseInventory;
