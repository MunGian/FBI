import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import icons from '../../constants/icons';
import { fetchUserDetails } from '../supabaseAPI/api';
import { supabase } from '../../services/supabase';

const Achievement = ({ navigation }) => {
  
    const [donationCount, setDonationCount] = useState(0);
    const [requestCount, setRequestCount] = useState(0);
    const [articleCount, setArticleCount] = useState(0);
    const [eventCount, setEventCount] = useState(0);

    const [user, setUser] = useState({
    name: "",
    email: "",
    profileImage: "",
    });
    
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

    const fetchDonationCount = async () => {
        if (!user.email) return; // Ensure user email is valid
      
        try {
          const { data, error } = await supabase
            .from("receipt")
            .select("foodid")
            .not("foodid", "is", null) // Exclude NULL values
            .or(`donoremail.eq.${user.email},recipientemail.eq.${user.email}`);
      
          if (error) {
            console.error("Failed to fetch donation count:", error.message);
            return;
          }
      
          setDonationCount(data?.length || 0);
        } catch (error) {
          console.error("Failed to fetch donation count:", error.message);
        }
      };

      const fetchRequestCount = async () => {
        if (!user.email) return; // Ensure user email is valid
      
        try {
          const { data, error } = await supabase
            .from("receipt")
            .select("requestid")
            .not("requestid", "is", null) // Exclude NULL values
            .or(`donoremail.eq.${user.email},recipientemail.eq.${user.email}`);
      
          if (error) {
            console.error("Failed to fetch request count:", error.message);
            return;
          }
      
          setRequestCount(data?.length || 0);
        } catch (error) {
          console.error("Failed to fetch request count:", error.message);
        }
      };

      const fetchArticleCount = async () => {
        if (!user.email) return; // Ensure user email is valid
      
        try {
          const { data, error } = await supabase
            .from("article")
            .select("articleid")
            .eq("email", user.email);
      
          if (error) {
            console.error("Failed to fetch request count:", error.message);
            return;
          }
      
          setArticleCount(data?.length || 0);
        } catch (error) {
          console.error("Failed to fetch request count:", error.message);
        }
      };
      
      const fetchEventCount = async () => {
        if (!user.email) return; // Ensure user email is valid
      
        try {
          const { data, error } = await supabase
            .from("event")
            .select("eventid")
            .eq("email", user.email);
      
          if (error) {
            console.error("Failed to fetch request count:", error.message);
            return;
          }
      
          setEventCount(data?.length || 0);
        } catch (error) {
          console.error("Failed to fetch request count:", error.message);
        }
      };

      useEffect(() => {
        fetchUserData();
      }, []);
      
      useEffect(() => {
        fetchDonationCount();
        fetchRequestCount();
        fetchArticleCount();
        fetchEventCount();
      }, [user.email]);

    return (
        <SafeAreaView className="bg-[#50C878] h-full">
        <ScrollView className="bg-white rounded-t-3xl m-3">
            {/* Back Button */}
            <TouchableOpacity
            className="absolute top-4 left-4 bg-gray-300 p-3 rounded-full z-10"
            onPress={() => navigation.goBack()}
            >
            <Image
                source={icons.leftArrow}
                style={{ width: 24, height: 24, tintColor: '#333' }}
            />
            </TouchableOpacity>

            {/* About Section */}
            <View className="flex-row items-center justify-left mt-20 ml-7">
                <Text className="text-2xl font-pbold text-gray-800">
                    Your Achievements
                </Text>
            </View>

            <View className="mt-3 px-6">
                <View className="bg-gray-100 p-4 rounded-lg mb-2 ">
                    <View className="flex-row">
                    <Image 
                        source={icons.donate} 
                        className="w-15 h-15 mr-2" 
                        resizeMode="contain"
                    />
                    <Text className="text-gray-800 text-sm font-pmedium text-justify pt-1">
                        <Text className="text-[#1B627D] text-lg font-pbold">
                            You Have Completed {'\n'}
                            <Text className="text-xl">
                                {donationCount} {''}
                                Donation(s)!
                            </Text>
                        </Text>

                    </Text>
                    </View>
                </View>
            </View>

            <View className="mt-3 px-6">
                <View className="bg-gray-100 p-4 rounded-lg mb-2 ">
                    <View className="flex-row">
                    <Image 
                        source={icons.receive} 
                        className="w-15 h-15 mr-2" 
                        resizeMode="contain"
                    />
                    <Text className="text-gray-800 text-sm font-pmedium text-justify pt-1">
                        <Text className="text-[#1B627D] text-lg font-pbold">
                            You Have Completed {'\n'}
                            <Text className="text-xl">
                                {requestCount} {''}
                                Request(s)!
                            </Text>
                        </Text>

                    </Text>
                    </View>
                </View>
            </View>

            <View className="mt-3 px-6">
                <View className="bg-gray-100 p-4 rounded-lg mb-2 ">
                    <View className="flex-row">
                    <Image 
                        source={icons.article} 
                        className="w-15 h-15 mr-2" 
                        resizeMode="contain"
                    />
                    <Text className="text-gray-800 text-sm font-pmedium text-justify pt-1">
                        <Text className="text-[#1B627D] text-lg font-pbold">
                            You Have Posted {'\n'}
                            <Text className="text-xl">
                                {articleCount} {''}
                                Article(s)!
                            </Text>
                        </Text>

                    </Text>
                    </View>
                </View>
            </View>

            <View className="mt-3 px-6">
                <View className="bg-gray-100 p-4 rounded-lg mb-2 ">
                    <View className="flex-row">
                    <Image 
                        source={icons.event} 
                        className="w-15 h-15 mr-2" 
                        resizeMode="contain"
                    />
                    <Text className="text-gray-800 text-sm font-pmedium text-justify pt-1">
                        <Text className="text-[#1B627D] text-lg font-pbold">
                            You Have Posted {'\n'}
                            <Text className="text-xl">
                                {eventCount} {''}
                                Event(s)!
                            </Text>
                        </Text>

                    </Text>
                    </View>
                </View>
            </View>

          <View className="px-6 m-4 mt-3 bg-yellow-100 p-4 rounded-lg mb-1 text-lg font-psemibold">
            <Text className="text-gray-800 text-base font-pbold text-justify">
                Thank You for Making a Difference!
            </Text>
            <Text className="text-gray-800 font-psemibold text-justify">
                Every contribution you make — whether donating surplus food, sharing knowledge, or engaging with our community — brings us closer to a world with less food waste and more kindness.
                Your generosity and efforts play a vital role in nourishing communities and protecting our planet. We’re proud to celebrate your achievements and grateful to have you as part of the 
                <Text className="text-[#1B627D] font-pbold">
                    {' '}WasteNot{' '}
                </Text>
                family. Together, let’s continue to make a meaningful impact!
            </Text>
          </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Achievement;