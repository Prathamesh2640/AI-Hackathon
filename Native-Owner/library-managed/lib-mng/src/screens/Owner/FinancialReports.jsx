import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";

const FinancialReports = () => {
  const [overview, setOverview] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/owner/reports/financial-overview");
      setOverview(response.data);
    } catch (error) {
      console.error("Failed to fetch financial reports:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const overviewData = [
    {
      label: "Monthly Revenue",
      value: `₹${overview.monthlyRevenue?.toLocaleString() || "0"}`,
    },
    {
      label: "Monthly Expenses",
      value: `₹${overview.monthlyExpenses?.toLocaleString() || "0"}`,
    },
    {
      label: "Net Profit",
      value: `₹${overview.netProfit?.toLocaleString() || "0"}`,
    },
    { label: "Profit Margin", value: `${overview.profitMargin || "0"}%` },
  ];

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Financial Reports" showBackButton />
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <Text style={globalStyles.title}>Financial Summary</Text>
        <Text style={globalStyles.subtitle}>
          Key financial performance indicators.
        </Text>

        <FlatList
          data={overviewData}
          renderItem={({ item }) => (
            <StatCard label={item.label} value={item.value} />
          )}
          keyExtractor={(item) => item.label}
          numColumns={2}
          scrollEnabled={false}
        />

        <Text style={globalStyles.sectionTitle}>Breakdown</Text>
        <Card>
          <View style={styles.row}>
            <Text style={styles.label}>Total Assets Value</Text>
            <Text style={styles.value}>
              ₹{overview.totalAssets?.toLocaleString() || "0"}
            </Text>
          </View>
          {/* More detailed breakdown items would go here */}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
});

export default FinancialReports;
