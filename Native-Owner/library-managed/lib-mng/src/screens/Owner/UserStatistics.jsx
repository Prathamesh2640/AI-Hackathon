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

const UserStatistics = () => {
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/owner/stats/users");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
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
    { label: "Total Members", value: stats.totalMembers || "0" },
    { label: "Active This Month", value: stats.activeMembers || "0" },
    { label: "New This Month", value: stats.newMembersThisMonth || "0" },
    { label: "Unpaid Members", value: stats.inactiveMembers || "0" }, // Using 'inactive' from controller as unpaid
  ];

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="User Statistics" showBackButton />
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <Text style={globalStyles.title}>Member Statistics</Text>
        <Text style={globalStyles.subtitle}>
          Key metrics about the library's members.
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

export default UserStatistics;
