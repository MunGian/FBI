import React from 'react';
import { Text, View, Image, TouchableOpacity, Linking } from 'react-native';

const renderEventComponent = ({navigation, ...props }) => (
  <TouchableOpacity
    className="bg-white p-3 mb-3 rounded-lg shadow-md ml-4 mr-4"
    style={{ overflow: 'hidden' }} // Clip overflowing content
    onPress={() => navigation.navigate('EventDetail', { eventDetail: props })} 
  >
    <View className="flex-row justify-between items-center">
      {props.eventphotourl ? (
        <Image
          source={{ uri: props.eventphotourl }}
          className="w-24 h-24 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
          <Text className="text-xs text-gray-500">No Image</Text>
        </View>
      )}

      <View className="flex-1 ml-3">
        <Text
          className="text-lg font-semibold text-[#50C878]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.eventtitle}
        </Text>

        <Text className="text-sm font-text-gray-500">
          <Text className="font-psemibold">Event Date: </Text>
          {props.eventdate
            ? new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(new Date(props.eventdate))
            : 'N/A'}
        </Text>

        <View>
          <Text className="text-sm text-gray-500"
            numberOfLines={4} // Limit to one line and add ellipsis
            ellipsizeMode="tail" // Truncate at the end if overflowed
          >
            <Text className="font-psemibold">
                Description: {''}
            </Text>
            <Text>
                {props.eventdescription}
            </Text>
          </Text>
        </View>

        {/* <Text className="text-sm text-gray-500">
          <Text className="font-psemibold">Posted By: </Text>
          {`${props.postfirstname} ${props.postlastname}` || 'N/A'}
        </Text> */}
      </View>
    </View>
  </TouchableOpacity>
);


export default renderEventComponent;
