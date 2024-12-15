import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

const ButtonCustom = (props) => {
  return (
    <TouchableOpacity 
      className= {`bg-[#1B627D] rounded-xl min-h-[62px] justify-center items-center 
                  ${props.containerStyles} ${props.isLoading ? 'opacity-50' : ''}`}
      onPress={props.handlePress}
      activeOpacity={0.7}
      disabled={props.isLoading}
    >
      <Text className={`text-[#FFF] font-psemibold text-lg ${props.textStyles}`}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;