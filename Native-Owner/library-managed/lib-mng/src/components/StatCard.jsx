import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";
import { Colors } from "../styles/globalStyles";

const StatCard = ({ label, value }) => {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default StatCard;
