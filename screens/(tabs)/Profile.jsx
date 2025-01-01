import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, SafeAreaView, Linking } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import { fetchUserDetails } from '../supabaseAPI/api';
import icons from '../../constants/icons';
import { supabase } from '../../services/supabase';

const ProfileScreen = ({ navigation }) => {
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
      // console.error("Failed to fetch user data:", error.message);
    }
  };

  const handleContactSupport = () => {
    const email = "wastenotofficial@gmail.com";
    const subject = "Support Inquiry"; 
    const body = ""; 

    // Construct the mailto URL
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Use Linking to open the email client
    Linking.openURL(mailto).catch((err) => {
      console.error("Failed to open email client:", err);
    });
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
                Invite your friends to join 
                <Text className="text-[#1B627D] font-pbold">
                  {' '}WasteNot{' '}
                </Text>
                and start sharing surplus food today!
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
          <Text className="text-black text-base font-pbold mb-2">
            GENERAL
          </Text>

          {/* Push Notifications */}
          {/* <View className="bg-gray-100 p-4 rounded-lg mb-2 flex-row items-center">
            <Text className="flex-1 text-gray-800 font-semibold">
              Push notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(value)}
              thumbColor={notificationsEnabled ? "#50C878" : "#f4f3f4"}
              trackColor={{ false: "#d1d5db", true: "#50C878" }}
            />
          </View> */}

          {/* Your Achievements */}
          <TouchableOpacity
            className="p-4 rounded-lg flex-row items-center border-b-2 border-gray-400 mt-1"
            onPress={() => navigation.navigate('Achievement')}
          >
            <Image 
              source={icons.achievement} 
              className="w-8 h-8 mr-2" 
              resizeMode="contain"
            />
            <Text className="flex-1 text-gray-800 font-semibold">Your Achievements</Text>
            <Text className="text-black">&gt;</Text>
          </TouchableOpacity>

          {/* Support */}
          <TouchableOpacity
            className="p-4 rounded-lg flex-row items-center border-b-2 border-gray-400 mt-1"
            onPress={handleContactSupport}
          >
            <Image 
              source={icons.support} 
              className="w-8 h-8 mr-2" 
              resizeMode="contain"
            />
            <Text className="flex-1 text-gray-800 font-semibold">Contact Support</Text>
            <Text className="text-black">&gt;</Text>
          </TouchableOpacity>

          {/* Term and Policy */}
          <TouchableOpacity
            className="p-4 rounded-lg flex-row items-center border-b-2 border-gray-400 mt-1"
            onPress={() => navigation.navigate('Terms')}
          >
            <Image 
              source={icons.term} 
              className="w-7 h-7 mr-2" 
              resizeMode="contain"
            />
            <Text className="flex-1 text-gray-800 font-semibold">Terms & Policies</Text>
            <Text className="font-3xl text-black">&gt;</Text>
          </TouchableOpacity>

          {/* About*/}
          <TouchableOpacity
            className="p-4 rounded-lg flex-row items-center border-b-2 border-gray-400 mt-1"
            onPress={() => navigation.navigate('About')}
          >
            <Image 
              source={icons.about} 
              className="w-7 h-7 mr-2" 
              resizeMode="contain"
            />
            <Text className="flex-1 text-gray-800 font-semibold">About</Text>
            <Text className="font-3xl text-black">&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View className="mt-8 px-6 mb-10">
          <TouchableOpacity
            onPress={logout}
            className="bg-gray-100 p-4 rounded-lg flex-row items-center justify-center"
          >
            <Image
              source={icons.logout}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <Text className="text-red-500 text-base font-pbold pl-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
