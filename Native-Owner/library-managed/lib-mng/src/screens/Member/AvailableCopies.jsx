import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import CustomHeader from "../../components/CustomHeader";
import { Colors, globalStyles } from "../../styles/globalStyles";
import Card from "../../components/Card";

const AvailableCopies = () => {
  const route = useRoute();
  const { user } = useContext(AuthContext);
  // Expecting the full book object with its 'copies' array to be passed in params
  const { book } = route.params;

  const handleBorrowRequest = (copy) => {
    if (!user.is_paid_member) {
      Alert.alert(
        "Membership Inactive",
        "Please contact the librarian to activate your membership before borrowing."
      );
      return;
    }

    if (copy.status !== "Available") {
      Alert.alert("Unavailable", "This specific copy is not available.");
      return;
    }

    // In a real app, you would make an API call here
    // POST /api/member/borrow/{copy.copy_id}
    Alert.alert(
      "Request Sent",
      `Your request to borrow Copy #${copy.copy_identifier} has been sent. Please visit the librarian's desk to pick it up.`
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return {
          container: styles.availableCard,
          text: styles.statusAvailableText,
        };
      case "Issued":
        return {
          container: styles.issuedCard,
          text: styles.statusIssuedText,
        };
      default:
        return {
          container: styles.otherCard,
          text: styles.statusOtherText,
        };
    }
  };

  const renderCopyItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <Card style={[styles.copyCard, statusStyle.container]}>
        <View style={styles.cardHeader}>
          <Text style={styles.copyId}>Copy: {item.copy_identifier}</Text>
          <Text style={[styles.statusBadge, statusStyle.text]}>
            {item.status}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Location: {item.rack?.rack_name || "N/A"}
          </Text>
          {/* Add more details like 'Condition' if available in the API response */}
        </View>
        {item.status === "Available" && (
          <TouchableOpacity
            style={[globalStyles.button, styles.borrowButton]}
            onPress={() => handleBorrowRequest(item)}
          >
            <Text style={globalStyles.buttonText}>Request This Copy</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  };

  return (
    <View style={styles.flexOne}>
      <CustomHeader title="All Copies" showBackButton />
      <FlatList
        style={globalStyles.container}
        data={book.copies || []}
        renderItem={renderCopyItem}
        keyExtractor={(item) => item.copy_id.toString()}
        ListHeaderComponent={
          <>
            <Text style={globalStyles.title} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={globalStyles.subtitle}>by {book.author}</Text>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No copies found for this book.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: { flex: 1, backgroundColor: Colors.background },
  copyCard: {
    marginVertical: 8,
    borderLeftWidth: 5,
  },
  availableCard: {
    borderColor: Colors.success,
    backgroundColor: "#f0fff0",
  },
  issuedCard: {
    borderColor: Colors.danger,
    backgroundColor: "#fff0f0",
  },
  otherCard: {
    borderColor: Colors.textSecondary,
    backgroundColor: "#f5f5f5",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  copyId: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statusAvailableText: {
    backgroundColor: Colors.successLight,
    color: Colors.success,
  },
  statusIssuedText: {
    backgroundColor: Colors.dangerLight,
    color: Colors.danger,
  },
  statusOtherText: {
    backgroundColor: Colors.border,
    color: Colors.textSecondary,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  borrowButton: {
    backgroundColor: Colors.secondary,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});

export default AvailableCopies;
