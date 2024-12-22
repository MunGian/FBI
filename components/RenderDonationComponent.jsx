import React, {useEffect} from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import icons from '../constants/icons';

const renderDonationComponent = ({ navigation, ...props }) => (
    <TouchableOpacity
      className="bg-white p-3 mb-3 rounded-lg shadow-md ml-4 mr-4"
      style={{ maxHeight: 150 }}
      onPress={props.page === "donation" ?
        () => navigation.navigate('DonationDetail', { donation: props }) 
      : () => navigation.navigate('RequestedDetail', { request: props }) 
    } // navigate to FoodDetail screen in home
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Image
            source={props.type === "recipient" ? icons.receive : icons.donate}
            className="mr-4 w-15 h-15"
          />
        </View>

        <View className="flex-1 mr-3">
          <Text className="text-lg font-semibold text-[#50C878]"
          numberOfLines={1} 
          ellipsizeMode="tail" 
          >
            {props.foodname}{props.requestname} 
          </Text>

          <Text className="text-sm font-semibold text-gray-600">{props.category}</Text>
          
          <Text className="text-sm text-gray-500">
            Receipt Date: {new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(props.receiptdate))}, {new Date(props.receiptdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </Text>

          <Text className="text-sm text-gray-500"
            numberOfLines={1} // Limit to one line and add ellipsis
            ellipsizeMode="tail" // Truncate at the end if overflowed
          >
            Address: {props.address}, {""}
            {props.district}
          </Text>
            
          {((props.donorstatus === "Pending" && props.type === "donor") || 
            (props.recipientstatus === "Pending" && props.type === "recipient")) &&
            (
              <TouchableOpacity 
                className="flex-row items-center mt-1"
                onPress={() => { 
                  navigation.navigate('RatingScreen', { donation: props }); 
                }}
              >
                <Text className="text-sm text-[#1B627D] font-psemibold mt-1 mr-1">
                  Rate
                </Text>

                <View className="pt-1">
                  <View
                    className="bg-[#ADD8E6] p-1.5 rounded-full shadow-lg"
                  >
                    <Image
                      source={icons.rightArrow}
                      style={{ width: 12, height: 12, tintColor: '#1B627D' }} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )
          }

        {/* {props.foodphoto_url ? (
          <Image
            source={{ uri: props.foodphoto_url }}
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
            <Text className="text-xs text-gray-500">No Image</Text>
          </View>
        )} */}
      </View>
      </View>
    </TouchableOpacity>
  );

  export default renderDonationComponent;