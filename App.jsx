import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './screens/TabNavigator'; 
import LandingPage from './screens/LandingPage'; 
import SignIn from './screens/(auth)/SignIn';
import SignUp from './screens/(auth)/SignUp';
import ResetPassword from './screens/(auth)/ResetPassword';
import FoodDetail from './screens/food/FoodDetail';
import EditFoodDetail from './screens/food/EditFoodDetail';
import CreateFoodDetail from './screens/food/CreateFoodDetail';
import RequestDetail from './screens/request/RequestDetail';
import CreateRequestDetail from './screens/request/CreateRequestDetail';
import EditRequestDetail from './screens/request/EditRequestDetail';

const Stack = createStackNavigator();

const App = () => {
  return (
    // <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"LandingPage"}>
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="FoodDetail" 
            component={FoodDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditFoodDetail" 
            component={EditFoodDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="CreateFoodDetail" 
            component={CreateFoodDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="RequestDetail" 
            component={RequestDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="CreateRequestDetail" 
            component={CreateRequestDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditRequestDetail" 
            component={EditRequestDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    // </AuthProvider>
  );
};

// const AuthWrapper = () => {
//   const authContext = useContext(AuthContext);
//   const { user } = authContext || {}; // Safely destructure user
// };

export default App;
