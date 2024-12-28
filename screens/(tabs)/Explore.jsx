import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image as RNImage, RefreshControl, SafeAreaView } from 'react-native';
import icons from '../../constants/icons';
import EmptyCustom from '../../components/EmptyCustom';
import RenderArticleComponent from '../../components/RenderArticleComponent';
import RenderEventComponent from '../../components/RenderEventComponent';
import { fetchArticles, fetchEvents } from '../supabaseAPI/api';
import { useFocusEffect } from '@react-navigation/native'; 
import { supabase } from '../../services/supabase';

const ExploreScreen = ({ navigation }) => {
  const [article, setArticle] = useState([]);
  const [event, setEvent] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeButton, setActiveButton] = useState("Articles"); // Default active button
 
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const updatedArticles = await fetchArticles(); // in api.jsx file
      setArticle(updatedArticles);
      const updatedEvents = await fetchEvents(); // in api.jsx file
      setEvent(updatedEvents);

    } catch (error) {
      console.error("Error refreshing articles/events list:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // Fetch articles and events
          const articles = await fetchArticles(); // in api.jsx file
          setArticle(articles);
  
          const events = await fetchEvents(); // in api.jsx file
          setEvent(events);
          

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
                activeButton === "Articles" ? "border-b-4 border-[#1B627D]" : ""
              }`}
              onPress={() => setActiveButton("Articles")}
            >
              <Text
                className={`text-center text-lg font-psemibold ${
                  activeButton === "Articles" ? "text-[#1B627D]" : "text-black"
                }`}
              >
                Articles
              </Text>
            </TouchableOpacity>
  
            {/* Requests Button */}
            <TouchableOpacity
              className={`ml-7 w-[47%] bg-white p-1.5 rounded-lg ${
                activeButton === "Events" ? "border-b-4 border-[#1B627D]" : ""
              }`}
              onPress={() => setActiveButton("Events")}
            >
              <Text
                className={`text-center text-lg font-psemibold ${
                  activeButton === "Events" ? "text-[#1B627D]" : "text-black"
                }`}
              >
                Events
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      
        {activeButton === "Articles" ? (
          // Article list
          <FlatList
            data={article}
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
                type="post"
              />
            )}
            ListEmptyComponent={() =>
              !loading && (
                <EmptyCustom
                  title="No Article Found"
                  description="There are no articles being uploaded yet."
                  handlePress={() => navigation.navigate('CreateArticle')}
                  buttonTitle="Upload New Article"
                />
              )
            }
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          // Event list
          <FlatList
            data={event}
            keyExtractor={(item, index) => item.eventid?.toString() || index.toString()}
            renderItem={({ item }) => {
              if (!item || Object.keys(item).length === 0) return null; // Return null if no item exists
              return (
                <RenderEventComponent
                  eventid={item.eventid}
                  eventtitle={item.eventtitle}
                  eventdate={item.eventdate}
                  eventdescription={item.eventdescription}
                  eventphotourl={item.eventphotourl}
                  eventurl={item.eventurl}
                  postemail={item.email}
                  postfirstname={item.users.firstname}
                  postlastname={item.users.lastname}
                  postphoto={item.users.photo_url}
                  postphone={item.users.phonenumber}
                  navigation={navigation}
                  type="post"
                />
              );
            }}
            ListEmptyComponent={() => (
              <EmptyCustom
                title="No Events Found"
                description="There are no events being organized yet."
                handlePress={() => navigation.navigate('CreateEvent')}
                buttonTitle="Create New Event"
              />
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
     

        {/* Floating Create new Food Button
        <TouchableOpacity
          onPress={() => {activeButton === 'Articles' ? navigation.navigate('CreateArticle') : navigation.navigate('CreateRequestDetail')}}
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

export default ExploreScreen;