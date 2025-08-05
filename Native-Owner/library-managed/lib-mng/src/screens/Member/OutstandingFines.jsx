import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const OutstandingFines = () => {
  const { user } = useContext(AuthContext);
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState(false);

  const fetchData = async () => {
    if (!user?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await api.get(`/api/member/fines/${user.id}`);
      setFines(response.data);
    } catch (error) {
      console.error("Failed to fetch outstanding fines:", error);
      Alert.alert("Error", "Could not load your fines data.");
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
    }, [user])
  );

  const handlePayFines = async () => {
    setPaying(true);
    try {
      const paymentPromises = fines.map((fine) =>
        api.post(`/api/member/fines/${fine.borrowing_id}/pay`)
      );
      await Promise.all(paymentPromises);
      Alert.alert(
        "Success",
        "All outstanding fines have been paid successfully."
      );
      fetchData(); // Refresh the list, which should now be empty
    } catch (error) {
      Alert.alert(
        "Payment Failed",
        error.response?.data?.message ||
          "Could not process payment. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  const totalFines = fines.reduce(
    (sum, item) => sum + parseFloat(item.fine_amount),
    0
  );

  const renderItem = ({ item }) => (
    <Card style={styles.fineCard}>
      <Text style={styles.title}>{item.bookCopy.book.title}</Text>
      <Text style={styles.detailText}>
        Due Date: {new Date(item.due_date).toLocaleDateString()}
      </Text>
      <Text style={styles.detailText}>
        Return Date: {new Date(item.return_date).toLocaleDateString()}
      </Text>
      <Text style={styles.fineAmount}>
        Fine Amount: ₹{parseFloat(item.fine_amount).toFixed(2)}
      </Text>
    </Card>
  );

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Outstanding Fines" showBackButton />
      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : fines.length > 0 ? (
        <FlatList
          style={globalStyles.container}
          data={fines}
          renderItem={renderItem}
          keyExtractor={(item) => item.borrowing_id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <>
              <Text style={globalStyles.title}>Unpaid Fines</Text>
              <Card style={styles.totalCard}>
                <Text style={styles.totalLabel}>Total Amount Due</Text>
                <Text style={styles.totalAmount}>₹{totalFines.toFixed(2)}</Text>
              </Card>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  { marginBottom: 20 },
                  paying && styles.disabledButton,
                ]}
                onPress={handlePayFines}
                disabled={paying}
              >
                {paying ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={globalStyles.buttonText}>Pay All Fines Now</Text>
                )}
              </TouchableOpacity>
              <Text style={globalStyles.sectionTitle}>Fine Details</Text>
            </>
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.containerFlex}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={globalStyles.title}>No Fines Due</Text>
          <View style={styles.goodStandingContainer}>
            <Text style={styles.goodStandingIcon}>🎉</Text>
            <Text style={styles.goodStandingText}>
              You have no outstanding fines. Keep up the great work!
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  containerFlex: { flex: 1, padding: 20 },
  fineCard: { marginVertical: 8 },
  title: { fontSize: 16, fontWeight: "bold" },
  detailText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  fineAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.danger,
    marginTop: 10,
  },
  totalCard: {
    alignItems: "center",
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.danger,
    marginVertical: 20,
  },
  totalLabel: { fontSize: 18, color: Colors.textSecondary },
  totalAmount: { fontSize: 32, fontWeight: "bold", color: Colors.danger },
  goodStandingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  goodStandingIcon: { fontSize: 80, marginBottom: 20 },
  goodStandingText: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  disabledButton: { backgroundColor: Colors.textSecondary },
});

export default OutstandingFines;
