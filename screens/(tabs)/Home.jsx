import React, { useState, useCallback } from 'react';
import { Text, TextInput, View, Image, FlatList, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchCustom from '../../components/SearchCustom';
import TrendingCustom from '../../components/TrendingCustom';
import EmptyCustom from '../../components/EmptyCustom';
import images from '../../constants/images';
import icons from '../../constants/icons';
import { fetchUserLastName, fetchFoodList, fetchRequestList, fetchFilteredFoodList,
        fetchFilteredRequestList, fetchSearchedFoodList, fetchSearchedRequestList } from '../supabaseAPI/api';
import RenderFoodComponent from '../../components/RenderFoodComponent';
import RenderRequestComponent from '../../components/RenderRequestComponent';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native'; 

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [foods, setFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [lastName, setLastName] = useState('');

  const [searchText, setSearchText] = useState('');
  const [searchRequest, setSearchRequest] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const categories = ['Fruits', 'Vegetables', 'Fast Food', 'Dairy', 'Meat', 'Others'];
  const districts = [
    'Balik Pulau', 'Bayan Lepas', 'Bayan Baru', 'Gertak Sanggul', 'Pantai Acheh', 
    'Permatang Damar Laut', 'Sungai Ara', 'Teluk Kumbar', 'George Town', 
    'Batu Feringghi', 'Tanjung Tokong', 'Pulau Tikus', 'Batu Lanchang', 
    'Air Itam', 'Paya Terubong', 'Jelutong', 'Gelugor'
  ];

  const [activeButton, setActiveButton] = useState("Foods"); // Default active button

  // Handle the change in search text and refresh the list accordingly
  const handleFoodSearchChange = (text) => {
    if (activeButton === "Foods") {
      setSearchText(text);
      fetchSearchedFood(text); // Fetch searched food immediately, in api.jsx file
    }
    else if (activeButton === "Requests") {
      setSearchRequest(text);
      fetchSearchedRequest(text); // Fetch searched requests immediately, in api.jsx file
    }
   };

   // Fetch food list based on the search query
   const fetchSearchedFood = async (query) => {
    try {
      // Fetch the filtered list of foods based on the search query
      const searchedFoods = await fetchSearchedFoodList(query);
      setFoods(searchedFoods);
    } catch (error) {
      console.error('Error fetching searched food list:', error.message);
    }
  };

  // Fetch food list based on the search query
  const fetchSearchedRequest = async (query) => {
    try {
      // Fetch the filtered list of requests based on the search query
      const searchedRequests= await fetchSearchedRequestList(query);
      setRequests(searchedRequests);
    } catch (error) {
      console.error('Error fetching searched food list:', error.message);
    }
  };

  const applyFoodFilters = async () => {
    try {
      // console.log('Applied Filters:', { category: selectedCategory, district: selectedDistrict });
      // Fetch the filtered food list
      const foodItems = await fetchFilteredFoodList(selectedCategory, selectedDistrict); // in api.jsx file
      // Update the foods state with the fetched items
      setFoods(foodItems);
      // Close the modal
      setModalVisible(false);
  
    } catch (error) {
      console.error("Error applying filters:", error.message);
    }
  };

  const applyRequestFilters = async () => {
    try {
      // console.log('Applied Filters:', { category: selectedCategory, district: selectedDistrict });
      // Fetch the filtered food list
      const requestItems = await fetchFilteredRequestList(selectedCategory, selectedDistrict); // in api.jsx file
      // Update the foods state with the fetched items
      setRequests(requestItems);
      // Close the modal
      setModalVisible(false);
  
    } catch (error) {
      console.error("Error applying filters:", error.message);
    }
  };

  const prefetchFoodData = async () => {
    const newFoods = await fetchFoodList(); // in api.jsx file
    setFoods(newFoods);
  };

  const prefetchRequestData = async () => {
    const newRequests = await fetchRequestList(); // in api.jsx file
    setRequests(newRequests);
  };
  
  const fetchInitialData = async () => {
    try {
      const name = await fetchUserLastName(); // in api.jsx file
      setLastName(name || 'User'); // Fallback to User if no name is found
    } catch (error) {
      console.error('Error fetching initial data:', error.message);
    }
  };

  useFocusEffect(
     useCallback(() => {
      fetchInitialData(); // Fetch data every time the screen is focused
      prefetchFoodData();
      prefetchRequestData();
      }, [])
 );
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updateFoods = await fetchFoodList();
      setFoods(updateFoods);
      const updateRequests = await fetchRequestList();
      setRequests(updateRequests);

      setSearchText(''); // Clear the search food text
      setSearchRequest(''); // Clear the search request text
      setSelectedCategory(''); // Clear the selected category
      setSelectedDistrict(''); // Clear the selected district
    } catch (error) {
      console.error('Error refreshing food list:', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <View className="my-3 px-4 space-y-4">
          {/* Header */}
          <View className="justify-between items-start flex-row mb-1 mt-5">
            <View>
              <Text className="font-pmedium text-xl text-white">Welcome Back, </Text>
              <Text className="text-3xl font-psemibold text-white">{lastName}</Text>
            </View>
            <Image
              source={images.logoSmall}
                resizeMode="contain"
              className="w-[64px] h-[64px]"
            />
          </View>

          <View className="flex-row items-center justify-between">

            {/* SearchCustom Component */}
            <SearchCustom
              placeholder={activeButton === 'Foods' ? "Search for Foods" : "Search for Requests"}
              value={activeButton === 'Foods' ? searchText : searchRequest}
              handleChangeText={handleFoodSearchChange}
            />

            {/* Filter Button */}
            <TouchableOpacity
              className="bg-white p-2 border-2 border-black-100  rounded-2xl"
              onPress={() => setModalVisible(true)}
            >
              <Image
                source={icons.filter}
                resizeMode="contain"
                className="w-10 h-10"
              />
            </TouchableOpacity>

            {/* Modal */}
            <Modal
              transparent={true}
              animationType="fade"
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              {/* Semi-Transparent Background */}
              <View className="flex-1 bg-black/20 justify-center items-center">
                {/* Modal Content */}
                <View className="bg-white rounded-lg p-6 w-11/12">
                  <Text className="text-lg font-pbold mb-4">Filter Options</Text>

                  {/* Category Picker */}
                  <Text className="text-base font-pregular mb-2">Select Category:</Text>
                  <View className="bg-gray-100 rounded-lg mb-4">
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                    >
                      <Picker.Item label="Display All Categories" value="" />
                      {categories.map((category, index) => (
                        <Picker.Item key={index} label={category} value={category} />
                      ))}
                    </Picker>
                  </View>

                  {/* District Picker */}
                  <Text className="text-base font-pregular  mb-2">Select District:</Text>
                  <View className="bg-gray-100 rounded-lg mb-4">
                    <Picker
                      selectedValue={selectedDistrict}
                      onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                    >
                      <Picker.Item label="Display All Districts" value="" />
                      {districts.map((district, index) => (
                        <Picker.Item key={index} label={district} value={district} />
                      ))}
                    </Picker>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      className="bg-gray-200 py-2 px-4 rounded-lg mr-3"
                      onPress={() => setModalVisible(false)} // Close without saving
                    >
                      <Text className="text-base font-pregular text-gray-700">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-green-500 py-2 px-4 rounded-lg"
                      onPress={activeButton === 'Foods' ? applyFoodFilters : applyRequestFilters} // Save and close
                    >
                      <Text className="text-base font-pregular text-white">Apply Filters</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

        {/* Section Title */}
        <View className="flex-row items-center">
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
              Foods
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
              Requests
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeButton === "Foods" 
      ? (
        // Food list
        <FlatList
          data={foods}
          keyExtractor = {(item, index) => item.foodID?.toString() || index.toString()}
          renderItem={({ item }) => {
            if (!item || Object.keys(item).length === 0) return null; // Return null if no item exists
            return (
              <RenderFoodComponent   // render all food through food component
                foodid = {item.foodid}
                foodname = {item.foodname}
                category = {item.category}
                expirydate = {item.expirydate}
                quantity = {item.quantity}
                address= {item.address}
                district = {item.district}
                foodphoto_url = {item.foodphoto_url}
                description = {item.description}
                navigation={navigation}
                food='available'
              />
            )
          }}
          // ListHeaderComponent={() => (
          // )}
          ListEmptyComponent={() => (
            <EmptyCustom
              title="No Foods Found"
              description="There are no relevant foods found at the moment."
              handlePress={() => navigation.navigate('CreateFoodDetail')}
              buttonTitle="Post New Food"
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) 
      : (
        // Request list
        <FlatList
          data={requests}
          keyExtractor = {(item, index) => item.foodID?.toString() || index.toString()}
          renderItem={({ item }) => {
            if (!item || Object.keys(item).length === 0) return null; // Return null if no item exists
            return (
              <RenderRequestComponent   // render all food through food component
                requestid = {item.requestid}
                requestname = {item.requestname}
                category = {item.requestcategory}
                requestdate = {item.requestdate}
                quantity = {item.requestquantity}
                address= {item.requestaddress}
                district = {item.requestdistrict}
                description = {item.requestdescription}
                userphoto = {item.users.photo_url}
                firstname = {item.users.firstname}
                lastname = {item.users.lastname}
                type = "request"
                navigation={navigation}
              />
            )
          }}
          // ListHeaderComponent={() => (   
          // )}
          ListEmptyComponent={() => (
            <EmptyCustom
              title="No Requests Found"
              description="There are no relevant requests found at the moment."
              handlePress={() => navigation.navigate('CreateRequestDetail')}
              buttonTitle="Post New Request"
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}       
  </SafeAreaView> 
  ); 
};


export default HomeScreen;
