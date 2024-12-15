import React from 'react';
import { View, Text, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../constants/images';
import ButtonCustom from "../components/ButtonCustom";

const Index = ({ navigation }) => {
  return (
    <SafeAreaView className="bg-[#50C878] h-full">
        <ScrollView contentContainerStyle={{ height: '100%' }}>
            <View className="justify-center items-center w-full h-[95vh] px-4">
                <View className="flex-row items-center">
                    <Image
                    source={images.logo}
                    resizeMode="contain"
                    className="w-[450px] h-[200px] -mb-8"
                    />
                    {/* <Text className="text-3xl font-pblack">WasteNot</Text> */}
                </View>

                <Image
                    source={images.indexPic}
                    resizeMode="contain"
                    className="max-w-[400px]  w-full h-[300px]"
                /> 

                <View className="relative mt-5">
                    <Text className="text-3xl text-white font-bold text-center">
                        Redefine Food Value Save, Share, Sustain with {''}
                        <Text className="text-[#1B627D]">
                            WasteNot
                        </Text>
                    </Text>
                    <Text className="text-sm font-pmedium mt-4 text-center">
                        Encourage everyone to give leftover food a new purpose.
                        Give a second life to your surplus food – nourish people, not landfills.
                    </Text>
                </View>

                <ButtonCustom 
                    title="Continue with Email"
                    handlePress={() => navigation.navigate('SignIn')}
                    containerStyles="w-full mt-7"
                />
            </View>
        </ScrollView>
        <StatusBar backgroundColor="#50C878" barStyle="light-content" />
    </SafeAreaView>
  );
};

export default Index;