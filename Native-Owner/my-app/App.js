import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GlobalProvider, useGlobalContext } from "./utils/GlobalState";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import MemberDashboard from "./screens/MemberDashboard";
import BookSearch from "./screens/BookSearch";
import BorrowingHistory from "./screens/BorrowingHistory";
import PersonalFines from "./screens/PersonalFines";
import BookDetails from "./screens/BookDetails";
import AvailableCopies from "./screens/AvailableCopies";
import Profile from "./screens/Profile";
import ChangePassword from "./screens/ChangePassword";
import BorrowedBooks from "./screens/BorrowedBooks";
import PaymentHistory from "./screens/PaymentHistory";
import OwnerDashboard from "./screens/OwnerDashboard";
import UserStatistics from "./screens/UserStatistics";
import BookInventory from "./screens/BookInventory";
import FinancialReports from "./screens/FinancialReports";
import CollectionReports from "./screens/CollectionReports";
import AssetReports from "./screens/AssetReports";
import BookManagement from "./screens/BookManagement";
import BorrowReturn from "./screens/BorrowReturn";
import OverdueBooks from "./screens/OverdueBooks";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}
          />
          <Stack.Screen name="MemberDashboard" component={MemberDashboard} />
          <Stack.Screen name="BookSearch" component={BookSearch} />
          <Stack.Screen name="BorrowingHistory" component={BorrowingHistory} />
          <Stack.Screen name="PersonalFines" component={PersonalFines} />
          <Stack.Screen name="BookDetails" component={BookDetails} />
          <Stack.Screen name="AvailableCopies" component={AvailableCopies} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="BorrowedBooks" component={BorrowedBooks} />
          <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
          <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
          <Stack.Screen name="UserStatistics" component={UserStatistics} />
          <Stack.Screen name="BookInventory" component={BookInventory} />
          <Stack.Screen name="FinancialReports" component={FinancialReports} />
          <Stack.Screen
            name="CollectionReports"
            component={CollectionReports}
          />
          <Stack.Screen name="AssetReports" component={AssetReports} />
          <Stack.Screen name="BookManagement" component={BookManagement} />
          <Stack.Screen name="BorrowReturn" component={BorrowReturn} />
          <Stack.Screen name="OverdueBooks" component={OverdueBooks} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
