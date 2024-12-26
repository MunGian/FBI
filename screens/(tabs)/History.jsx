import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image as RNImage, RefreshControl, SafeAreaView } from 'react-native';
import icons from '../../constants/icons';
import EmptyCustom from '../../components/EmptyCustom';
import RenderFoodComponent from '../../components/RenderFoodComponent';
import RenderDonatedComponent from '../../components/RenderDonationComponent';
import RenderRequestComponent from '../../components/RenderRequestComponent';
import { fetchDonatedHistory, fetchRequestHistory } from '../supabaseAPI/api';
import { useFocusEffect } from '@react-navigation/native'; 
import { supabase } from '../../services/supabase';

const HistoryScreen = ({ navigation }) => {
  const [donationHistory, setDonationHistory] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeButton, setActiveButton] = useState("Foods"); // Default active button
  const [userTypeDonationMap, setUserTypeDonationMap] = useState({}); // Store user type for each `donoremail`.
  const [userTypeRequestMap, setUserTypeRequestMap] = useState({}); // Store user type for each `donoremail`.
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedDonations = await fetchDonatedHistory(); // in api.jsx file
      setDonationHistory(updatedDonations);
      const updatedRequests = await fetchRequestHistory(); // in api.jsx file
      setRequestHistory(updatedRequests);

      // Determine user types (donations)
      const userTypeDonationResults = {};
      for (const item of updatedDonations) {
        const type = await checkDonorOrRecipient(item.donoremail);
        userTypeDonationResults[item.receiptid] = type; // Map by unique ID (e.g., receiptid).
      }
      setUserTypeDonationMap(userTypeDonationResults);

      // Determine user types (requests)
      const userTypeRequestResults = {};
      for (const item of updatedRequests) {
        const type = await checkDonorOrRecipient(item.donoremail);
        userTypeRequestResults[item.receiptid] = type; // Map by unique ID (e.g., receiptid).
      }
      setUserTypeRequestMap(userTypeRequestResults);

    } catch (error) {
      console.error("Error refreshing donation/request list:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const checkDonorOrRecipient = async (donorEmail) => {
    try {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (error || !user?.email) throw new Error("No authenticated user found");

      return donorEmail === user.email ? "donor" : "recipient";
    } catch (err) {
      console.error("Error checking donor or recipient:", err);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // Fetch donations and requests
          const donations = await fetchDonatedHistory(); // in api.jsx file
          setDonationHistory(donations);
  
          const requests = await fetchRequestHistory(); // in api.jsx file
          setRequestHistory(requests);
          
          // Determine user types
          const userTypeDonationResults = {};
          for (const item of donations) {
            const type = await checkDonorOrRecipient(item.donoremail);
            userTypeDonationResults[item.receiptid] = type; // Map by unique ID (e.g., receiptid).
          }
          setUserTypeDonationMap(userTypeDonationResults);
          
          // Determine user types (requests)
          const userTypeRequestResults = {};
          for (const item of requests) {
            const type = await checkDonorOrRecipient(item.donoremail);
            userTypeRequestResults[item.receiptid] = type; // Map by unique ID (e.g., receiptid).
          }
          setUserTypeRequestMap(userTypeRequestResults);

        } catch (error) {
          console.error("Error fetching food list:", error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []) // Dependency array
  );

  return (
<SafeAreaView className="bg-[#50C878] h-full">
      <View className="my-3 px-4 space-y-4">
        {/* Section Title */}
        <View className="flex-row items-center mt-10">
            {/* Foods Button */}
            <TouchableOpacity
              className={`w-[47%] bg-white p-1.5 rounded-lg ${
                activeButton === "Foods" ? "border-b-4 border-[#1B627D]" : ""
              }`}
              onPress={() => setActiveButton("Foods")}
            >
              <Text
                className={`text-center text-lg font-psemibold ${
                  activeButton === "Foods" ? "text-[#1B627D]" : "text-black"
                }`}
              >
                Donation History
              </Text>
            </TouchableOpacity>
  
            {/* Requests Button */}
            <TouchableOpacity
              className={`ml-7 w-[47%] bg-white p-1.5 rounded-lg ${
                activeButton === "Requests" ? "border-b-4 border-[#1B627D]" : ""
              }`}
              onPress={() => setActiveButton("Requests")}
            >
              <Text
                className={`text-center text-lg font-psemibold ${
                  activeButton === "Requests" ? "text-[#1B627D]" : "text-black"
                }`}
              >
                Request History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      
        {activeButton === "Foods" ? (
          // Donation list
          <FlatList
            data={donationHistory}
            keyExtractor={(item, index) => item.receiptid?.toString() || index.toString()}
            renderItem={({ item }) => (
              <RenderDonatedComponent
                foodid={item.fooditem.foodid} 
                foodname={item.fooditem.foodname}
                category={item.fooditem.category}
                expirydate={item.fooditem.expirydate}
                quantity={item.fooditem.quantity}
                address={item.fooditem.address}
                district={item.fooditem.district}
                foodphoto_url={item.fooditem.foodphoto_url}
                description={item.fooditem.description}
                donoremail={item.donoremail}
                recipientemail={item.recipientemail}
                receiptid={item.receiptid}
                receiptdate={item.receiptdate}
                donorfeedback={item.donorfeedback}
                donorrating={item.donorrating}
                recipientfeedback={item.recipientfeedback}
                recipientrating={item.recipientrating}
                donorstatus={item.donorstatus}
                recipientstatus={item.recipientstatus}
                navigation={navigation}
                type={userTypeDonationMap[item.receiptid]} // Pass pre-fetched type here.
                page="donation"
              />
            )}
            ListEmptyComponent={() =>
              !loading && (
                <EmptyCustom
                  title="No Donation History Found"
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
            data={requestHistory}
            keyExtractor={(item, index) => item.requestid?.toString() || index.toString()}
            renderItem={({ item }) => {
              if (!item || Object.keys(item).length === 0) return null; // Return null if no item exists
              return (
                <RenderDonatedComponent
                  requestid={item.request.requestid}
                  requestname={item.request.requestname}
                  category={item.request.requestcategory}
                  quantity={item.request.requestquantity}
                  address={item.request.requestaddress}
                  district={item.request.requestdistrict}
                  description={item.request.requestdescription}
                  donoremail={item.donoremail}
                  recipientemail={item.recipientemail}
                  receiptid={item.receiptid}
                  receiptdate={item.receiptdate}
                  donorfeedback={item.donorfeedback}
                  donorrating={item.donorrating}
                  recipientfeedback={item.recipientfeedback}
                  recipientrating={item.recipientrating}
                  donorstatus={item.donorstatus}
                  recipientstatus={item.recipientstatus}
                  navigation={navigation}
                  type={userTypeRequestMap[item.receiptid]} // Pass pre-fetched type here.
                  page="request"
                />
              );
            }}
            ListEmptyComponent={() => (
              <EmptyCustom
                title="No Request History Found"
                description="You haven't requested any food yet."
                handlePress={() => navigation.navigate('CreateRequestDetail')}
                buttonTitle="Create New Request"
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
     

        {/* Floating Create new Food Button
        <TouchableOpacity
          onPress={() => {activeButton === 'Foods' ? navigation.navigate('CreateFoodDetail') : navigation.navigate('CreateRequestDetail')}}
          className="absolute bottom-8 right-8 bg-[#1B627D] p-4 rounded-full shadow-lg"
        >
          <RNImage
              source={icons.plus}
              style={{ width: 28, height: 28, tintColor: 'white' }} 
          />
        </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default HistoryScreen;