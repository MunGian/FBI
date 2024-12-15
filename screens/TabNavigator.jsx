import React from 'react';
import 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, Text } from 'react-native';
import HomeScreen from './(tabs)/Home';
import ProfileScreen from './(tabs)/Profile';
import HistoryScreen from './(tabs)/History';
import CreateScreen from './(tabs)/Create';
import icons from '../constants/icons';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ icon, color, name, focused }) => { 
  return (
    <View className="items-center justify-center">
      <Image 
        source={icon} 
        resizeMode="contain"
        tintColor={color}
        className="w-6  h-6" 
      />
      <Text className={`${focused ? 'font-psemibold' : 'font-pregular'}`} style={{ color: color}}> 
        {name}
      </Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
      <Tab.Navigator 
        screenOptions={{ 
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#50C878',   // Active tab icon color
          tabBarInactiveTintColor: 'grey', // Inactive tab icon color
          tabBarStyle: {
            backgroundColor: 'white', // Tab bar background color
            borderTopWidth: 1, // Remove top border
            borderTopColor: '#D3D3D3', // Remove top border
            height: 65, // Tab bar height
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.home}  
                name="Home"
                color={color}
                focused={focused} 
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Create" 
          component={CreateScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
                icon={icons.plus} 
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.history}
                color={color}   
                name="History"
                focused={focused}
              />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={icons.profile} 
                color={color}  
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
};


export default TabNavigator;
