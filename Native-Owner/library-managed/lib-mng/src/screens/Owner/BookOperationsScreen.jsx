import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { api } from "../../api/axiosConfig";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";

const BookOperationsScreen = () => {
  const [copyIdentifier, setCopyIdentifier] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIssue = async () => {
    if (!copyIdentifier || !memberId) {
      Alert.alert(
        "Input Error",
        "Please provide both Copy Identifier and Member ID."
      );
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        `/api/owner/borrow/issue/${copyIdentifier}/${memberId}`
      );
      Alert.alert("Success", response.data.message);
      setCopyIdentifier("");
      setMemberId("");
    } catch (error) {
      console.error("Issue failed:", error.response?.data || error);
      Alert.alert(
        "Issue Failed",
        error.response?.data?.message || "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!copyIdentifier) {
      Alert.alert(
        "Input Error",
        "Please provide the Copy Identifier to return."
      );
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(
        `/api/owner/borrow/return/${copyIdentifier}`
      );
      const { message, fine_amount } = response.data;
      let alertMessage = message;
      if (fine_amount > 0) {
        alertMessage += `\n\nFine of ₹${fine_amount.toFixed(
          2
        )} is due. Please collect from member.`;
      }
      Alert.alert("Return Processed", alertMessage);
      setCopyIdentifier("");
    } catch (error) {
      console.error("Return failed:", error.response?.data || error);
      Alert.alert(
        "Return Failed",
        error.response?.data?.message || "An error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="Book Operations" showBackButton />
      <ScrollView style={globalStyles.container}>
        <Text style={globalStyles.title}>Issue a Book</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Copy Identifier (e.g., CC-001)"
          value={copyIdentifier}
          onChangeText={setCopyIdentifier}
        />
        <TextInput
          style={[globalStyles.input, styles.mt]}
          placeholder="Member ID (e.g., 2)"
          value={memberId}
          onChangeText={setMemberId}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[globalStyles.button, styles.mt]}
          onPress={handleIssue}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>Issue Book</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={globalStyles.title}>Return a Book</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Copy Identifier (e.g., CC-001)"
          value={copyIdentifier}
          onChangeText={setCopyIdentifier}
        />
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary, styles.mt]}
          onPress={handleReturn}
          disabled={loading}
        >
          <Text
            style={[globalStyles.buttonText, globalStyles.buttonTextSecondary]}
          >
            Return Book
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  mt: { marginTop: 15 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 40 },
});

export default BookOperationsScreen;
