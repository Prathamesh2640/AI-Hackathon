import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";

// Import Screen Components
// Common
import LoginScreen from "../screens/Common/LoginScreen";
import RegistrationScreen from "../screens/Common/RegistrationScreen";

// Owner
import OwnerDashboard from "../screens/Owner/OwnerDashboard";
import AssetReports from "../screens/Owner/AssetReports";
import BookWiseCopies from "../screens/Owner/BookWiseCopies";
import CollectionReports from "../screens/Owner/CollectionReports";
import FinancialReports from "../screens/Owner/FinancialReports";
import SubjectWiseInventory from "../screens/Owner/SubjectWiseInventory";
import UserStatistics from "../screens/Owner/UserStatistics";
import BookOperationsScreen from "../screens/Owner/BookOperationsScreen";
import ManageMembersScreen from "../screens/Owner/ManageMembersScreen";
import AddBookScreen from "../screens/Owner/AddBookScreen";

// Member
import MemberDashboard from "../screens/Member/MemberDashboard";
import BookSearch from "../screens/Member/BookSearch";
import BookDetails from "../screens/Member/BookDetails";
import AvailableCopies from "../screens/Member/AvailableCopies";
import BorrowedBooks from "../screens/Member/BorrowedBooks";
import BorrowingHistory from "../screens/Member/BorrowingHistory";
import OutstandingFines from "../screens/Member/OutstandingFines";
import ProfileScreen from "../screens/Member/ProfileScreen";
import ChangePasswordScreen from "../screens/Member/ChangePasswordScreen";
import PaymentHistory from "../screens/Member/PaymentHistory";

const Stack = createStackNavigator();

// Stack for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegistrationScreen} />
  </Stack.Navigator>
);

// Stack for authenticated 'Owner' users
const OwnerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
    <Stack.Screen name="UserStatistics" component={UserStatistics} />
    <Stack.Screen
      name="SubjectWiseInventory"
      component={SubjectWiseInventory}
    />
    <Stack.Screen name="BookWiseCopies" component={BookWiseCopies} />
    <Stack.Screen name="FinancialReports" component={FinancialReports} />
    <Stack.Screen name="CollectionReports" component={CollectionReports} />
    <Stack.Screen name="AssetReports" component={AssetReports} />
    <Stack.Screen name="BookOperations" component={BookOperationsScreen} />
    <Stack.Screen name="ManageMembers" component={ManageMembersScreen} />
    <Stack.Screen name="AddBook" component={AddBookScreen} />
  </Stack.Navigator>
);

// Stack for authenticated 'Member' users
const MemberStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MemberDashboard" component={MemberDashboard} />
    <Stack.Screen name="BookSearch" component={BookSearch} />
    <Stack.Screen name="BookDetails" component={BookDetails} />
    <Stack.Screen name="AvailableCopies" component={AvailableCopies} />
    <Stack.Screen name="BorrowedBooks" component={BorrowedBooks} />
    <Stack.Screen name="BorrowingHistory" component={BorrowingHistory} />
    <Stack.Screen name="OutstandingFines" component={OutstandingFines} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // Show a loading indicator while checking for a stored session
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token && user ? (
        user.role === "Owner" ? (
          <OwnerStack />
        ) : (
          <MemberStack />
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNavigator;
