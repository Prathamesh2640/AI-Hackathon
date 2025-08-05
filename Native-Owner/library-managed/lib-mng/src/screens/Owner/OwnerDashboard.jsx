import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import StatCard from "../../components/StatCard";
import ActionButton from "../../components/ActionButton";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const OwnerDashboard = () => {
  const navigation = useNavigation();
  const [summary, setSummary] = useState({ kpis: {}, recentActivities: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/owner/dashboard-summary");
      setSummary(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const kpiData = [
    {
      label: "Monthly Revenue",
      value: `₹${summary.kpis.monthlyRevenue?.toLocaleString() || "0"}`,
    },
    {
      label: "Total Members",
      value: summary.kpis.totalMembers?.toString() || "0",
    },
    {
      label: "Books Issued",
      value: summary.kpis.booksIssued?.toString() || "0",
    },
    {
      label: "Outstanding Fines",
      value: `₹${summary.kpis.outstandingFines?.toLocaleString() || "0"}`,
    },
  ];

  const quickActions = [
    { title: "User Statistics", screen: "UserStatistics" },
    { title: "Manage Members", screen: "ManageMembers" },
    { title: "Book Operations", screen: "BookOperations" },
    { title: "Add New Book", screen: "AddBook" },
  ];

  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>
        <Text style={{ fontWeight: "bold" }}>{item.member.username}</Text>
        {item.return_date ? " returned " : " borrowed "}"
        {item.bookCopy.book.title}"
      </Text>
      <Text style={styles.activityDate}>
        {new Date(item.issue_date).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.flexOne}>
        <CustomHeader title="Owner Dashboard" />
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Owner Dashboard" />
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={globalStyles.title}>Business Overview</Text>
        <FlatList
          data={kpiData}
          renderItem={({ item }) => (
            <StatCard label={item.label} value={item.value} />
          )}
          keyExtractor={(item) => item.label}
          numColumns={2}
          scrollEnabled={false}
        />

        <Text style={[globalStyles.sectionTitle, styles.sectionMargin]}>
          Quick Actions
        </Text>
        <FlatList
          data={quickActions}
          renderItem={({ item }) => (
            <View style={styles.actionItem}>
              <ActionButton
                title={item.title}
                onPress={() => navigation.navigate(item.screen)}
              />
            </View>
          )}
          keyExtractor={(item) => item.title}
          numColumns={2}
          scrollEnabled={false}
        />

        <Text style={[globalStyles.sectionTitle, styles.sectionMargin]}>
          Recent Activity
        </Text>
        <Card>
          <FlatList
            data={summary.recentActivities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.borrowing_id.toString()}
            scrollEnabled={false}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  sectionMargin: { marginTop: 20 },
  actionItem: { flex: 1, marginHorizontal: 5 },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityText: { flex: 1, color: Colors.text },
  activityDate: { color: Colors.textSecondary, fontSize: 12 },
});

export default OwnerDashboard;
