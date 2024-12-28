import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import icons from '../constants/icons';

const renderRequestComponent = ({ navigation, ...props }) => (
    <TouchableOpacity
      className="bg-white p-3 mb-3 rounded-lg shadow-md ml-4 mr-4"
      style={{ maxHeight: 150 }}
      onPress={() => navigation.navigate('RequestDetail', { requestItem: props })} // navigate to FoodDetail screen in search
    >
      <View className="flex-row justify-between items-center">

        <View className="justify-center items-center pt-5">

          {props.type !== "self" && (props.userphoto ? (
            <View>
              <Image
                source={{ uri: props.userphoto }}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <Text className="text-center font-psemibold text-gray-600 mt-1">
                {props.firstname} {props.lastname}
              </Text>
            </View>
          ) : (
            <View className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
              <Text className="text-xs text-gray-500">No Image</Text>
            </View>
          ))}

         {props.type === "self" && 
            <Image
              source={ icons.donate }
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
        }
        </View>

        <View className="flex-1 ml-3">
          <Text className="text-base font-pbold text-[#50C878]"
          numberOfLines={1} 
          ellipsizeMode="tail" 
          >
            {props.requestname}
          </Text>
          <Text className="text-sm font-pbold text-gray-600">{props.category}</Text>
          <Text className="text-sm text-gray-500">
            <Text className="font-psemibold">
              Post Date:  {''}
            </Text>
            {new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(props.requestdate))}, {new Date(props.requestdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </Text>
          <Text className="text-sm text-gray-500"
            numberOfLines={1}
            ellipsizeMode="tail" 
          >
            <Text className="font-psemibold">
              Quantity: {''}
            </Text>
            {props.quantity}
          </Text>
          <Text className="text-sm text-gray-500"
            numberOfLines={1} // Limit to one line and add ellipsis
            ellipsizeMode="tail" // Truncate at the end if overflowed
          >
            <Text className="font-psemibold">
              Address: {''}
            </Text>
            {props.address}, {""}
            {props.district}
          </Text>
          {/* <Text className="text-xs text-gray-400">{props.description}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );

  export default renderRequestComponent;