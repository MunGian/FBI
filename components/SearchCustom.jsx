import {Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, {memo} from 'react'
import icons from '../constants/icons';

const SearchCustom = (props) => {
    
  return (
    <View className="w-[82%] items-center h-16 px-4 bg-white border-2 border-black-100 
                    rounded-2xl focus:border-[#1B627D] flex-row space-x-4">
        <TextInput 
            className="text-base text-black-200 flex-1 font-psemibold"
            value={props.value}
            placeholder={props.placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={props.handleChangeText}
        />

        <TouchableOpacity>
            <Image 
                source={icons.search}
                className="w-6 h-6 tintColor='black'"
                resizeMode="contain"
                style={{ tintColor: 'black' }}
            />
        </TouchableOpacity>
    </View>
  );
};

export default memo(SearchCustom);