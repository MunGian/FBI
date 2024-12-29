import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import icons from '../../constants/icons';

const About = ({ navigation }) => {
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
        <View className="flex-row items-center justify-center mt-20">
          <Text className="text-2xl font-pbold text-gray-800">
            About
            <Text>
                <Text className="text-[#1B627D] font-pbold"> WasteNot</Text>
            </Text>
          </Text>
         
        </View>
        <View className="mt-3 px-6">
          <View className="bg-gray-100 p-4 rounded-lg mb-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 text-sm font-pmedium text-justify">
               <Text className="text-[#1B627D] font-pbold">
                WasteNot {''}
               </Text>
                is a food waste reduction app dedicated to connecting individuals and restaurants to 
                share surplus food, reduce waste, and nourish communities. Our platform empowers users to 
                donate and manage excess food effortlessly, promoting sustainability and kindness. Together, 
                we can redefine the value of food—saving resources, supporting those in need, and protecting our planet.
              </Text>
            </View>
          </View>
        </View>

        {/* Mission Section */}
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-2xl font-pbold text-gray-800">
            Our Mission
          </Text>
         
        </View>
        <View className="mt-3 px-6">
          <View className="bg-gray-100 p-4 rounded-lg mb-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 text-sm font-pmedium text-justify">
               To create a world where surplus food is not wasted but shared, ensuring everyone has access 
               to nutritious meals while reducing environmental impact.
            </Text>
            </View>
          </View>
        </View>

        {/* Credit Section */}
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-2xl font-pbold text-gray-800">
            Credits
          </Text>
         
        </View>
        <View className="mt-3 px-6">
          <View className="bg-gray-100 p-4 rounded-lg mb-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-gray-800 text-sm font-pmedium text-justify">
              <Text className="text-[#1B627D] font-pbold">
              WasteNot {''}
              </Text>
              is developed and maintained by a passionate team committed to making a difference, 
              that consists of the following members:
            </Text>
            <Text className="text-gray-800 text-sm font-psemibold text-justify mt-1">
                1. Marcus Tan Tung Chean {'\n'}
                2. Ng Zi Jian {'\n'}
                3. Soo Mun Gian {'\n'}
                4. Tan Kit Seng
            </Text>
            </View>
          </View>
        </View>  

      </ScrollView>
    </SafeAreaView>
  );
};

export default About;