import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import { fetchUserDetails } from '../supabaseAPI/api';
import icons from '../../constants/icons';
import { supabase } from '../../services/supabase';

const ProfileScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: "",
  });

  // Fetch user data when the screen is focused
  const fetchUserData = async () => {
    try {
      const userData = await fetchUserDetails();
      // console.log(userData);
      setUser({
        name: `${userData.firstname} ${userData.lastname}`,
        email: userData.email,
        profileImage: userData.photo_url || "", // Ensure photo_url is valid or empty
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData(); // Fetch user data every time the screen is focused
    }, [])
  );

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      console.error('Error logging out:', error.message);
      alert('Failed to log out. Please try again.');
    } else {
      console.log('User logged out successfully.');
      navigation.replace('SignIn');
    }
  };

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <ScrollView className="bg-white rounded-t-3xl m-3">
        {/* Profile Header */}
        <View className="items-center mt-10">
          <Image
            source={user.profileImage ? { uri: user.profileImage } : icons.defaultUserIcon} // Use default image if profileImage is empty or invalid
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-2xl font-pbold text-gray-800 mt-4">
            {user.name}
          </Text>
          <Text className="text-pregular text-gray-500">{user.email}</Text>

          {/* Edit Profile Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            className="mt-4 bg-black px-6 py-2 rounded-full"
          >
            <Text className="text-white font-psemibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Invite Section */}
        <TouchableOpacity className="mt-6 px-6">
          <View className="bg-gray-100 p-4 rounded-lg mb-2 flex-row items-center">
            <View className="w-[82%]">
              <Text className="text-gray-800 font-pbold">
                Invite Friends
              </Text>
              <Text className="text-gray-800 font-psemibold">
                Invite your friends to join WasteNot and start sharing surplus food today!
              </Text>
            </View>

            <View className="pl-3">
              <Image
                  source={icons.invite} 
                  className="w-12 h-12 rounded-lg" 
                  resizeMode="contain"
                />
            </View>
          </View>
        </TouchableOpacity>

        {/* Preferences Section */}
        <View className="mt-5 px-6">
          <Text className="text-gray-400 text-xs font-semibold mb-2">
            PREFERENCES
          </Text>

          {/* Push Notifications */}
          <View className="bg-gray-100 p-4 rounded-lg mb-2 flex-row items-center">
            <Text className="flex-1 text-gray-800 font-semibold">
              Push notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              thumbColor={notificationsEnabled ? "#50C878" : "#f4f3f4"}
              trackColor={{ false: "#d1d5db", true: "#50C878" }}
            />
          </View>

          {/* Support */}
          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg flex-row items-center">
            <Text className="flex-1 text-gray-800 font-semibold">Support</Text>
            <Text className="text-gray-400">&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="mt-8 px-6 mb-10">
          <TouchableOpacity
            onPress={logout}
            className="bg-gray-100 p-4 rounded-lg flex-row items-center"
          >
            <Image
              source={icons.logout}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <Text className="text-red-500 font-pbold pl-3">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
