import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';

const renderFoodComponent = ({ navigation, ...props }) => (
    <TouchableOpacity
      className="bg-white p-3 mb-3 rounded-lg shadow-md ml-4 mr-4"
      style={{ maxHeight: 150 }}
      onPress={() => navigation.navigate('FoodDetail', { foodItem: props })} // navigate to FoodDetail screen in home
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-[#50C878]"
          numberOfLines={1} 
          ellipsizeMode="tail" 
          >
            {props.foodname}
          </Text>
          <Text className="text-sm font-semibold text-gray-600">{props.category}</Text>
          <Text className="text-sm text-gray-500">
            Expiry: {new Date(props.expirydate).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-gray-500"
            numberOfLines={1}
            ellipsizeMode="tail" 
          >
            Quantity: {props.quantity}
          </Text>
          <Text className="text-sm text-gray-500"
            numberOfLines={1} // Limit to one line and add ellipsis
            ellipsizeMode="tail" // Truncate at the end if overflowed
          >
            Address: {props.address}, {""}
            {props.district}
          </Text>
          {/* <Text className="text-xs text-gray-400">{props.description}</Text> */}
        </View>
        {props.foodphoto_url ? (
          <Image
            source={{ uri: props.foodphoto_url }}
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
            <Text className="text-xs text-gray-500">No Image</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  export default renderFoodComponent;