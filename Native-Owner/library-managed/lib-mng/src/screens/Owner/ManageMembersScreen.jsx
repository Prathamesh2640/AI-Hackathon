import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Switch,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const ManageMembersScreen = () => {
  const [members, setMembers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await api.get("/api/owner/members");
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      Alert.alert("Error", "Could not load member data.");
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const handleStatusChange = async (memberId, newValue) => {
    // Optimistically update UI
    setMembers((prevMembers) =>
      prevMembers.map((m) =>
        m.user_id === memberId ? { ...m, is_paid_member: newValue } : m
      )
    );

    try {
      await api.put(`/api/owner/members/${memberId}/paid-status`, {
        is_paid_member: newValue,
      });
      Alert.alert("Success", "Member status updated.");
    } catch (error) {
      Alert.alert("Error", "Failed to update member status. Please try again.");
      // Revert UI on failure
      fetchData();
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.memberCard}>
      <View>
        <Text style={styles.name}>
          {item.full_name} (@{item.username})
        </Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <View style={styles.switchContainer}>
        <Text>Paid:</Text>
        <Switch
          trackColor={{ false: Colors.dangerLight, true: Colors.successLight }}
          thumbColor={item.is_paid_member ? Colors.success : Colors.danger}
          onValueChange={(newValue) =>
            handleStatusChange(item.user_id, newValue)
          }
          value={item.is_paid_member}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Manage Members" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
        ListHeaderComponent={
          <Text style={globalStyles.title}>All Library Members</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { color: Colors.textSecondary },
  switchContainer: { alignItems: "center" },
});

export default ManageMembersScreen;
