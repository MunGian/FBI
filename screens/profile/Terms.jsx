import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import icons from '../../constants/icons';

const Terms = ({ navigation }) => {
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
            Terms & Policies of
            <Text>
                <Text className="text-[#1B627D] font-pbold"> WasteNot</Text>
            </Text>
          </Text>
         
        </View>
        
        <View className="mt-3 px-6">
          <View className="bg-gray-100 p-4 rounded-lg mb-2 items-left">
            <Text className="text-black text-sm font-pmedium text-justify">
               <Text className="text-base font-pbold">
                Acceptance of Terms {'\n'}
               </Text>
                By using the 
                <Text className="text-[#1B627D] font-pbold">
                {' '}WasteNot{' '}
                </Text>
                app, you agree to these terms and conditions. 
                If you do not agree, please refrain from using the app.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Eligibility {'\n'}
               </Text>
               Users must be 18 years or older or have parental/guardian consent to use the app. 
               You are responsible for ensuring the accuracy of the information you provide.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Donations {'\n'}
               </Text>
               &#8226; Food donations must comply with local health and safety regulations {'\n'}
               &#8226; Donors are responsible for the quality and safety of the food shared through 
               <Text className="text-[#1B627D] font-pbold">
                {' '}WasteNot.
               </Text>
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                User Conduct{'\n'}
               </Text>
               Users are prohibited from: {'\n'}
               &#8226; Posting inappropriate, harmful, or illegal content.{'\n'}
               &#8226; Using the app for fraudulent activities.{'\n'}
               &#8226; Harassing or abusing other users.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Limitation of Liability {'\n'}
               </Text>
               <Text className="text-[#1B627D] font-pbold">
                WasteNot{' '}
               </Text>
               is not responsible for: {'\n'}
               &#8226; The quality or condition of donated food.{'\n'}
               &#8226; Any harm caused by the use of donated food.{'\n'}
               &#8226; Interactions between users outside of the platform.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Refund Policy {'\n'}
               </Text>
               Since
                <Text className="text-[#1B627D] font-pbold">
                 {' '}WasteNot{' '}
                </Text>
               is a free platform facilitating donations, no transactions or 
               payments are made through the app. Therefore, no refunds are applicable.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Changes to Terms {'\n'}
               </Text>
               We reserve the right to update these terms at any time. Continued use of the app 
               implies acceptance of the updated terms.
            </Text>
          </View>
        </View>

        {/* Privacy Policy Section */}
        <View className="items-center justify-center mt-5">
          <Text className="text-2xl font-pbold text-gray-800">
            Privacy Policy of
            <Text>
                <Text className="text-[#1B627D] font-pbold"> WasteNot</Text>
            </Text>
          </Text>
         
        </View>
        
        <View className="mt-3 px-6 mb-10">
          <View className="bg-gray-100 p-4 rounded-lg mb-2 items-left">
            <Text className="text-black text-sm font-pmedium text-justify">
               <Text className="text-base font-pbold">
               Information We Collect {'\n'}
               </Text>
               &#8226; Personal Information: Name, email, and location details when you create an account.{'\n'}
               &#8226; Activity Information: Data about the food items you donate, receive, or interact with on the app.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                How We Use Your Information {'\n'}
               </Text>
               &#8226; To connect donors and recipients.{'\n'}
               &#8226; To improve the app's functionality and user experience.{'\n'}
               &#8226; To send updates and promotional offers (you can opt out anytime).    
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Information Sharing{'\n'}
               </Text>
               We do not sell or rent your personal data. Your information may be shared: {'\n'}
               &#8226; With other users to facilitate donations.  {'\n'}
               &#8226; With legal authorities if required by law.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Data Security{'\n'}
               </Text>
               We implement reasonable security measures to protect your data but cannot guarantee complete security.
            </Text>

            <Text className="text-black text-sm font-pmedium text-justify mt-4">
               <Text className="text-base font-pbold">
                Your Rights {'\n'}
               </Text>
               You can: {'\n'}
               &#8226; Access, update, or delete your personal information.{'\n'}
               &#8226; Contact us at 
                <Text className="text-[#1B627D] font-pbold">
                    {' '} wastenotofficial@gmail.com {' '}
                </Text>
               for privacy-related concerns.
            </Text>

          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Terms;