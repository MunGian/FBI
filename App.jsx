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
import EditProfile from './screens/profile/EditProfile';
import DonationDetail from './screens/history/DonationDetails';
import RatingScreen from './screens/history/RatingScreen';
import RequestedDetail from './screens/history/RequestDetails';
import CompleteDetails from './screens/food/CompleteDetails';
import CreateArticle from './screens/explore/CreateArticle';
import ArticleDetail from './screens/explore/ArticleDetail';
import EditArticleDetail from './screens/explore/EditArticle';
import EventDetail from './screens/explore/EventDetail';
import EditEventDetail from './screens/explore/EditEvent';
import CreateEvent from './screens/explore/CreateEvent';
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
            name="CompleteDetails" 
            component={CompleteDetails} 
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
            name="CreateArticle" 
            component={CreateArticle} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ArticleDetail" 
            component={ArticleDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditArticleDetail" 
            component={EditArticleDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EventDetail" 
            component={EventDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="CreateEvent" 
            component={CreateEvent} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditEventDetail" 
            component={EditEventDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="DonationDetail" 
            component={DonationDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="RequestedDetail" 
            component={RequestedDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="RatingScreen" 
            component={RatingScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditRequestDetail" 
            component={EditRequestDetail} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="EditProfile" 
            component={EditProfile} 
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
