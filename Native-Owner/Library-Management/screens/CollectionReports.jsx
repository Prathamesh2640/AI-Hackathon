import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../utils/GlobalState";

const { width } = Dimensions.get("window");

const CollectionReports = () => {
  const navigation = useNavigation();
  const { books } = useGlobalContext();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const subjects = [...new Set(books.map((b) => b.subject))];
  const subjectStats = subjects.map((subject) => ({
    subject,
    count: books.filter((b) => b.subject === subject).length,
    totalCopies: books
      .filter((b) => b.subject === subject)
      .reduce((sum, b) => sum + b.totalCopies, 0),
    availableCopies: books
      .filter((b) => b.subject === subject)
      .reduce((sum, b) => sum + b.availableCopies, 0),
  }));

  const renderSubject = ({ item }) => (
    <View style={styles.subjectItem}>
      <Text style={styles.subjectTitle}>{item.subject}</Text>
      <View style={styles.subjectDetails}>
        <Text style={styles.detailText}>Books: {item.count}</Text>
        <Text style={styles.detailText}>Total Copies: {item.totalCopies}</Text>
        <Text style={styles.detailText}>
          Available Copies: {item.availableCopies}
        </Text>
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>Library Management System</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("OwnerDashboard")}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Collection Reports</Text>
          <Text style={styles.panelSubtitle}>
            View statistics about the library's collection
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>{books.length}</Text>
              <Text style={styles.kpiLabel}>Total Books</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {books.reduce((sum, b) => sum + b.totalCopies, 0)}
              </Text>
              <Text style={styles.kpiLabel}>Total Copies</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiNumber}>
                {books.reduce((sum, b) => sum + b.availableCopies, 0)}
              </Text>
              <Text style={styles.kpiLabel}>Available Copies</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>By Subject</Text>
          <Text style={styles.panelSubtitle}>
            Showing {subjectStats.length} subjects
          </Text>
          <FlatList
            data={subjectStats}
            renderItem={renderSubject}
            keyExtractor={(item) => item.subject}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  backLink: {
    padding: 10,
  },
  backLinkText: {
    color: "#007bff",
    fontSize: 16,
  },
  mainContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  panel: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  panelTitle: {
    color: "#333",
    fontSize: 20,
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  panelSubtitle: {
    color: "#666",
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  kpiCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: width / 2 - 30,
    minWidth: 150,
  },
  kpiNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  kpiLabel: {
    color: "#666",
    fontSize: 14,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subjectItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subjectDetails: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
});

export default CollectionReports;
