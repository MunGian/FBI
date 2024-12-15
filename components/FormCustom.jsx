import {Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

const FormCustom = (props) => {
    
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <View className= {`space-y-2 ${props.otherStyles}`}>
        <Text className="text-base text-white font-pmedium">
            {props.title}
        </Text>
        
        {/*Box for input*/}
        <View className="w-full items-center h-16 px-4 bg-white border-2 border-black-100 
                        rounded-2xl focus:border-[#1B627D] flex-row">
            <TextInput 
                className="w-full h-full text-black-200 font-psemibold"
                value={props.value}
                placeholder={props.placeholder}
                placeholderTextColor="#7b7b8b"
                onChangeText={props.handleChangeText}
                secureTextEntry={props.title === 'Password' || props.title === 'New Password' || props.title === 'Confirm New Password'? !showPassword : false}
            />

            {/* {props.title === 'Password' && 
             (<TouchableOpacity onPress={() => setShowPassword(!showPassword)}> 
                <Image source={!showPassword ? icons.eye : icons.eyehide} 
                        className="w-8 h-8 mr-10"/>
              </TouchableOpacity>
            )} */}
        </View>
    </View>
  );
};

export default FormCustom;