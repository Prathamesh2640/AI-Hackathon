import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import StatCard from "../../components/StatCard";
import ActionButton from "../../components/ActionButton";
import { Colors, globalStyles } from "../../styles/globalStyles";

const MemberDashboard = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const response = await api.get(
        `/api/member/dashboard/summary/${user.id}`
      );
      setSummary(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch member summary:",
        error.response?.data || error
      );
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const kpiData = [
    {
      label: "Books Borrowed",
      value: summary.currentlyBorrowedCount?.toString() || "0",
    },
    {
      label: "Total Fines Due",
      value: `₹${summary.outstandingFines?.toLocaleString() || "0"}`,
    },
    {
      label: "Total Books Read",
      value: summary.totalBooksRead?.toString() || "0",
    },
  ];

  const quickActions = [
    {
      title: "Search Books",
      subtitle: "Find your next read",
      screen: "BookSearch",
    },
    {
      title: "My Borrowed Books",
      subtitle: "View current loans",
      screen: "BorrowedBooks",
    },
    {
      title: "Borrowing History",
      subtitle: "See all past loans",
      screen: "BorrowingHistory",
    },
    {
      title: "Outstanding Fines",
      subtitle: "Check and pay fines",
      screen: "OutstandingFines",
    },
    {
      title: "Payment History",
      subtitle: "View all transactions",
      screen: "PaymentHistory",
    },
    { title: "My Profile", subtitle: "Update your details", screen: "Profile" },
  ];

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Member Dashboard" />
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      >
        <Text style={globalStyles.title}>
          Welcome, {user?.username || "Member"}!
        </Text>
        {!user?.is_paid_member && (
          <View style={styles.alertWarning}>
            <Text style={styles.alertText}>
              Your membership is not active. Please contact the librarian to
              make a payment.
            </Text>
          </View>
        )}

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
        {quickActions.map((action) => (
          <ActionButton
            key={action.title}
            title={action.title}
            subtitle={action.subtitle}
            onPress={() => navigation.navigate(action.screen)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  sectionMargin: { marginTop: 20 },
  alertWarning: {
    backgroundColor: Colors.warningLight,
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  alertText: {
    color: Colors.text,
    textAlign: "center",
  },
});

export default MemberDashboard;
