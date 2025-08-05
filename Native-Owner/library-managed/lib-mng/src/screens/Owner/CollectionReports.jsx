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

const CollectionReports = () => {
  const [overview, setOverview] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/owner/reports/collections-overview");
      setOverview(response.data);
    } catch (error) {
      console.error("Failed to fetch collection reports:", error);
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
      label: "Total Collections",
      value: `₹${overview.totalCollections?.toLocaleString() || "0"}`,
    },
    {
      label: "Membership Fees",
      value: `₹${overview.membershipFees?.toLocaleString() || "0"}`,
    },
    {
      label: "Fine Collections",
      value: `₹${overview.fineCollections?.toLocaleString() || "0"}`,
    },
    {
      label: "Outstanding Dues",
      value: `₹${overview.outstandingDues?.toLocaleString() || "0"}`,
    },
  ];

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Collection Reports" showBackButton />
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <Text style={globalStyles.title}>Collections Overview</Text>
        <Text style={globalStyles.subtitle}>
          Summary of all financial collections.
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
});

export default CollectionReports;
