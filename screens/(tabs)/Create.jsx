import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, ScrollView, FlatList, TouchableOpacity, Image, Image as RNImage, RefreshControl, SafeAreaView } from 'react-native';
import icons from '../../constants/icons';
import EmptyCustom from '../../components/EmptyCustom';
import RenderFoodComponent from '../../components/RenderFoodComponent';
import RenderRequestComponent from '../../components/RenderRequestComponent';
import RenderArticleComponent from '../../components/RenderArticleComponent';
import RenderEventComponent from '../../components/RenderEventComponent';
import { fetchDonatedFoodList, fetchRequestedFoodList, fetchMyArticleList, fetchMyEventList } from '../supabaseAPI/api';
import { useFocusEffect } from '@react-navigation/native'; 

const Create = ({ navigation }) => {
  const [userFoods, setUserFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
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
      const updatedArticles = await fetchMyArticleList(); // in api.jsx file
      setArticles(updatedArticles);
      const updatedEvents = await fetchMyEventList(); // in api.jsx file
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error refreshing list:", error.message);
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
        const articles = await fetchMyArticleList(); // in api.jsx file
        setArticles(articles);
        const events = await fetchMyEventList(); // in api.jsx file
        setEvents(events);
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
          {/* ScrollView for horizontal scrolling */}
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', paddingHorizontal: 8 }}
          >
            {/* Foods Button */}
            <TouchableOpacity
              className={`bg-white p-1.5 rounded-lg ${activeButton === 'Foods' ? 'border-b-4 border-[#1B627D]' : ''}`}
              style={{ width: 110 }} // Dynamically set width if needed
              onPress={() => setActiveButton('Foods')}
            >
              <Text className={`text-center text-lg font-psemibold ${activeButton === 'Foods' ? 'text-[#1B627D]' : 'text-black'}`}>
                Donations
              </Text>
            </TouchableOpacity>

            {/* Requests Button */}
            <TouchableOpacity
              className={`ml-3 bg-white p-1.5 rounded-lg ${activeButton === 'Requests' ? 'border-b-4 border-[#1B627D]' : ''}`}
              style={{ width: 100 }} // Dynamically set width if needed
              onPress={() => setActiveButton('Requests')}
            >
              <Text className={`text-center text-lg font-psemibold ${activeButton === 'Requests' ? 'text-[#1B627D]' : 'text-black'}`}>
                Requests
              </Text>
            </TouchableOpacity>

            {/* Articles Button */}
            <TouchableOpacity
              className={`ml-3 bg-white p-1.5 rounded-lg ${activeButton === 'Articles' ? 'border-b-4 border-[#1B627D]' : ''}`}
              style={{ width: 90 }} // Dynamically set width if needed
              onPress={() => setActiveButton('Articles')}
            >
              <Text className={`text-center text-lg font-psemibold ${activeButton === 'Articles' ? 'text-[#1B627D]' : 'text-black'}`}>
                Articles
              </Text>
            </TouchableOpacity>

            {/* Events Button */}
            <TouchableOpacity
              className={`ml-3 bg-white p-1.5 rounded-lg ${activeButton === 'Events' ? 'border-b-4 border-[#1B627D]' : ''}`}
              style={{ width: 90 }} // Dynamically set width if needed
              onPress={() => setActiveButton('Events')}
            >
              <Text className={`text-center text-lg font-psemibold ${activeButton === 'Events' ? 'text-[#1B627D]' : 'text-black'}`}>
                Events
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View className="bg-yellow-100 p-4 rounded-lg mb-1 text-lg font-psemibold">
          <Text className="text-gray-800 font-psemibold">
            View and manage your existing posts, or click the button at right bottom below to add new posts.
            Thank you for making a difference!
          </Text>
        </View>

      </View>

  {/* Conditional Rendering Based on activeButton */}
  {activeButton === "Foods" ? (
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
  ) : activeButton === "Requests" ? (
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
  ) : activeButton === "Articles" ? (
    // Article list
    <FlatList
      data={articles}
      keyExtractor={(item, index) => item.articleid?.toString() || index.toString()}
      renderItem={({ item }) => (
        <RenderArticleComponent
          articleid={item.articleid} 
          articletitle={item.articletitle}
          articledate={item.articledate}
          articledescription={item.articledescription}
          articlephotourl={item.articlephotourl}
          articleurl={item.articleurl}
          postemail={item.email}
          postfirstname={item.users.firstname}
          postlastname={item.users.lastname}
          postphoto={item.users.photo_url}
          postphone={item.users.phonenumber}
          navigation={navigation}
          type="self"
        />
      )}
      ListEmptyComponent={() =>
        !loading && (
          <EmptyCustom
            title="No Article Found"
            description="You haven't post any article yet."
            handlePress={() => navigation.navigate('CreateArticle')}
            buttonTitle="Upload New Article"
          />
        )
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  ) : (
    // Event list when activeButton === "Events"
    <FlatList
      data={events}
      keyExtractor={(item, index) => item.eventid?.toString() || index.toString()}
      renderItem={({ item }) => (
        <RenderEventComponent
          eventid={item.eventid}
          eventtitle={item.eventtitle}
          eventdate={item.eventdate}
          eventphotourl={item.eventphotourl}
          eventurl={item.eventurl}
          eventlocation={item.eventlocation}
          eventdescription={item.eventdescription}
          postemail={item.users.email}
          postfirstname={item.users.firstname}
          postlastname={item.users.lastname}
          postphoto={item.users.photo_url}
          postphone={item.users.phonenumber}
          navigation={navigation}
          type="self"
        />
      )}
      ListEmptyComponent={() => (
        <EmptyCustom
          title="No Events Found"
          description="You haven't posted any event yet."
          handlePress={() => navigation.navigate('CreateEvent')}
          buttonTitle="Create New Event"
        />
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )}

      {/* Floating Create new Food Button */}
      <TouchableOpacity
        onPress={() => {activeButton === 'Foods' ? navigation.navigate('CreateFoodDetail') 
                        : activeButton === "Requests" ? navigation.navigate('CreateRequestDetail')
                        : activeButton === "Articles" ? navigation.navigate('CreateArticle')
                        : navigation.navigate('CreateEvent')}}
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