import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, globalStyles } from "../styles/globalStyles";

const BookListItem = ({ book }) => {
  const navigation = useNavigation();

  // Calculate availability from copies
  const availableCopies = book.copies
    ? book.copies.filter((c) => c.status === "Available").length
    : 0;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("BookDetails", { bookId: book.book_id })
      }
    >
      <View style={styles.itemContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <View
            style={[
              styles.statusIndicator,
              {
                backgroundColor:
                  availableCopies > 0 ? Colors.success : Colors.danger,
              },
            ]}
          />
          <Text style={styles.availabilityText}>
            {availableCopies > 0
              ? `${availableCopies} Available`
              : "Unavailable"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default BookListItem;
