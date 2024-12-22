import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, Image as RNImage, RefreshControl, SafeAreaView } from 'react-native';
import icons from '../../constants/icons';
import EmptyCustom from '../../components/EmptyCustom';
import RenderFoodComponent from '../../components/RenderFoodComponent';
import RenderRequestComponent from '../../components/RenderRequestComponent';
import { fetchDonatedFoodList, fetchRequestedFoodList } from '../supabaseAPI/api';
import { useFocusEffect } from '@react-navigation/native'; 

const Create = ({ navigation }) => {
  const [userFoods, setUserFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeButton, setActiveButton] = useState("Foods"); // Default active button

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedFoods = await fetchDonatedFoodList(); // in api.jsx file
      setUserFoods(updatedFoods);
      const updatedRequests = await fetchRequestedFoodList(); // in api.jsx file
      setRequests(updatedRequests);
    } catch (error) {
      console.error("Error refreshing food list:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
    (async () => {
      try {
        const foods = await fetchDonatedFoodList(); // in api.jsx file
        setUserFoods(foods);
        const requests = await fetchRequestedFoodList(); // in api.jsx file
        setRequests(requests);
      } catch (error) {
        console.error("Error fetching food list:", error.message);
      } finally {
        setLoading(false);
      }
    })();
    }, [])
  );

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <View className="my-3 px-4 space-y-4">
        {/* Section Title */}
        <View className="flex-row items-center mt-10">
            {/* Foods Button */}
            <TouchableOpacity
              className="w-[47%] bg-white p-1.5 rounded-lg"
              onPress={() => setActiveButton("Foods")}
            >
              <Text
                className={`text-center text-lg font-psemibold ${
                  activeButton === "Foods" ? "text-[#1B627D]" : "text-black"
                }`}
              >
                My Donations
              </Text>
            </TouchableOpacity>
  
            {/* Requests Button */}
            <TouchableOpacity
              className="ml-6 w-[47%] bg-white p-1.5 rounded-lg"
              onPress={() => setActiveButton("Requests")}
            >
              <Text
                className={`text-center text-lg font-psemibold ${
                  activeButton === "Requests" ? "text-[#1B627D]" : "text-black"
                }`}
              >
                My Requests
              </Text>
            </TouchableOpacity>
          </View>
          <>
          {/* Subtitle */}
            <Text className="text-white text-base font-psemibold leading-relaxed mt-2">
              View and manage your donated foods, or click the button below to add new items for donation. 
              Thank you for making a difference!
            </Text>
          </>
        </View>
      
        {activeButton === "Foods" ? (
          // FlatList for Displaying User's Donated Foods
          <FlatList
            data={userFoods}
            keyExtractor={(item, index) => item.foodid?.toString() || index.toString()}
            renderItem={({ item }) => (
              <RenderFoodComponent
                foodid={item.foodid}
                foodname={item.foodname}
                category={item.category}
                expirydate={item.expirydate}
                quantity={item.quantity}
                address={item.address}
                district={item.district}
                foodphoto_url={item.foodphoto_url}
                description={item.description}
                navigation={navigation}
                food="donated"
              />
            )}
            ListEmptyComponent={() =>
              !loading && (
                <EmptyCustom
                  title="No Foods Found"
                  description="You haven't donated any food yet."
                  handlePress={() => navigation.navigate('CreateFoodDetail')}
                  buttonTitle="Create New Donation"
                />
              )
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          // Request list
          <FlatList
            data={requests}
            keyExtractor={(item, index) => item.requestid?.toString() || index.toString()}
            renderItem={({ item }) => {
              if (!item || Object.keys(item).length === 0) return null; // Return null if no item exists
              return (
                <RenderRequestComponent
                  requestid={item.requestid}
                  requestname={item.requestname}
                  category={item.requestcategory}
                  requestdate={item.requestdate}
                  quantity={item.requestquantity}
                  address={item.requestaddress}
                  district={item.requestdistrict}
                  description={item.requestdescription}
                  userphoto={item.users.photo_url}
                  firstname={item.users.firstname}
                  lastname={item.users.lastname}
                  type="self"
                  navigation={navigation}
                />
              );
            }}
            ListEmptyComponent={() => (
              <EmptyCustom
                title="No Requests Found"
                description="You haven't requested any food yet."
                handlePress={() => navigation.navigate('CreateRequestDetail')}
                buttonTitle="Create New Request"
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
     

        {/* Floating Create new Food Button */}
        
        <TouchableOpacity
          onPress={() => {activeButton === 'Foods' ? navigation.navigate('CreateFoodDetail') : navigation.navigate('CreateRequestDetail')}}
          className="absolute bottom-8 right-8 bg-[#1B627D] p-4 rounded-full shadow-lg"
        >
          <RNImage
              source={icons.plus}
              style={{ width: 28, height: 28, tintColor: 'white' }} 
          />
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Create;