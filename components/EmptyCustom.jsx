import { Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { images } from '../constants';
import ButtonCustom from '../components/ButtonCustom';

const EmptyCustom = (props) => {
  return (
    <View className="justify-center items-center px-4">
        <Image
            source={images.empty}
            className="w-[260px] h-[210px]"
        />
        
        <Text className="text-xl text-center font-psemibold text-white mt-1">
            {props.title}
        </Text>
        <Text className="font-pmedium text-sm text-white">
            {props.description}
        </Text>

        <TouchableOpacity 
            className= {`bg-[#1B627D] rounded-xl min-h-[62px] w-[95%] mt-5 justify-center items-center 
                        ${props.containerStyles} ${props.isLoading ? 'opacity-50' : ''}`}
            onPress={props.handlePress}
            activeOpacity={0.7}
            disabled={props.isLoading}
        >
            <Text className={`text-[#FFF] font-psemibold text-lg ${props.textStyles}`}>
                {props.buttonTitle}
            </Text>
        </TouchableOpacity>
    </View>
  )
}

export default EmptyCustom;
