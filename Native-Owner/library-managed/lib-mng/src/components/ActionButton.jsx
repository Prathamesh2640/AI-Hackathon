import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../styles/globalStyles";
import Card from "./Card";

const ActionButton = ({ title, subtitle, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.actionCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionCard: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

export default ActionButton;
