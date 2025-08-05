import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";

const AssetReports = () => {
  const [stats, setStats] = useState({});
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, breakdownRes] = await Promise.all([
        api.get("/api/owner/reports/asset-stats"),
        api.get("/api/owner/reports/asset-breakdown"),
      ]);
      setStats(statsRes.data);
      setBreakdown(breakdownRes.data);
    } catch (error) {
      console.error("Failed to fetch asset reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [])
  );

  const overviewData = [
    {
      label: "Total Asset Value",
      value: `₹${stats.totalAssetValue?.toLocaleString() || "0"}`,
    },
    { label: "Total Books", value: stats.totalBooks || "0" },
    { label: "Total Copies", value: stats.totalCopies || "0" },
    { label: "Utilization", value: stats.utilizationRate || "0%" },
  ];

  if (loading) {
    return (
      <View style={styles.flexOne}>
        <CustomHeader title="Asset Reports" showBackButton />
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Asset Reports" showBackButton />
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={globalStyles.title}>Asset Overview</Text>
        <FlatList
          data={overviewData}
          renderItem={({ item }) => (
            <StatCard label={item.label} value={item.value} />
          )}
          keyExtractor={(item) => item.label}
          numColumns={2}
          scrollEnabled={false}
        />

        <Text style={globalStyles.sectionTitle}>Valuation by Category</Text>
        <Card>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Category</Text>
            <Text style={styles.headerText}>Books</Text>
            <Text style={[styles.headerText, { textAlign: "right" }]}>
              Value
            </Text>
          </View>
          {breakdown.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.cellText, { flex: 2 }]}>
                {item.category_name}
              </Text>
              <Text style={styles.cellText}>{item.book_count}</Text>
              <Text style={[styles.cellText, { textAlign: "right" }]}>
                ₹{parseInt(item.total_value).toLocaleString()}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: { flex: 1, fontWeight: "bold", color: Colors.textSecondary },
  tableRow: { flexDirection: "row", paddingVertical: 10, alignItems: "center" },
  cellText: { flex: 1, color: Colors.text },
});

export default AssetReports;
