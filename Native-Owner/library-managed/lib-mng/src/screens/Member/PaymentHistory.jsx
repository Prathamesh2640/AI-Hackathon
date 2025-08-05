import React, { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      const response = await api.get(`/api/member/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      Alert.alert("Error", "Could not load payment history.");
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [user])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.paymentCard}>
      <View style={styles.row}>
        <Text style={[styles.type, item.type === "Fine" && styles.fineType]}>
          {item.type}
        </Text>
        <Text style={styles.amount}>₹{parseFloat(item.amount).toFixed(2)}</Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.date}>
        {new Date(item.payment_date).toLocaleString()}
      </Text>
    </Card>
  );

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Payment History" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.payment_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListHeaderComponent={
          <Text style={globalStyles.title}>All Transactions</Text>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have no payment history.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  paymentCard: { marginVertical: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  type: { fontSize: 16, fontWeight: "bold" },
  fineType: { color: Colors.warning },
  amount: { fontSize: 18, fontWeight: "bold", color: Colors.primary },
  description: { color: Colors.textSecondary },
  date: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 10,
    textAlign: "right",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

export default PaymentHistory;
