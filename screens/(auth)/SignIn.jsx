import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../constants/images';
import FormCustom from '../../components/FormCustom';
import ButtonCustom from '../../components/ButtonCustom';
import { supabase } from '../../services/supabase';
import Animated, { BounceInDown, BounceOut, FadeInLeft, FadeOut, FadeInRight, useSharedValue, withTiming, useAnimatedKeyboard, useAnimatedStyle} from 'react-native-reanimated';

const SignIn = ({ navigation }) => {
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = React.useState(false);

  const whitepart = useSharedValue(0);

  useEffect(() => {
    whitepart.value = withTiming(615, { duration: 500 }); // Animate to 100px height
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: whitepart.value,
    };
  });

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data } = await supabase.auth.getSession();
  //     console.log("Session Data:", data);
  //     if (data?.session) {
  //       navigation.replace('Main', { screen: 'Home' }); // Navigate if session exists
  //     }
  //   };
  //   checkSession();
  // }, []);
    
  const LogIn = async () => {
    if (form.email && form.password) {
      setSubmitting(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
  
        if (error) {
          Alert.alert("Login Error", "The email or password you entered is incorrect.");
          throw error;
        }

        // const session = await supabase.auth.getSession();
        // console.log("Session Data:", session);

        navigation.replace('Main', { screen: 'Home' });
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    } else {
      Alert.alert("Input Error", "Please enter your email and password");
    }
  };

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      {/* <Animated.View
        className="absolute bottom-0 left-0 right-0 h-[600px] bg-white rounded-t-[30px] shadow-2xl shadow-black"
        style={animatedStyle}
      /> */}

      <ScrollView>
        <View className="justify-center w-full min-h-[95vh] px-4 my-2">
          {/* Vine Image */}
          <View className="absolute right-0 top-0"> 
            <Animated.Image
              entering={FadeInRight.delay(300).springify()}
              source={images.vine}
              resizeMode="contain"
              className="w-[350px] h-[180px]"
            />
          </View>
          
          <View className="flex-row items-center">
            <Animated.Image entering={FadeInRight.springify()}
              source={images.logo}
              resizeMode="contain"
              className="w-[300px] h-[170px] -ml-5 -mb-4" 
            />
            {/* <Text className="text-3xl font-pblack">WasteNot</Text> */}
          </View>
          
          <Text className="text-2xl text-black font-psemibold ml-2">
            Log in to <Text className="text-[#1B627D] font-pbold">WasteNot</Text>
          </Text>

          <View className='mb-2 ml-2'>
            <FormCustom
              title="Email"
              value={form.email}
              handleChangeText={(text) => setForm({ ...form, email: text })}
              otherStyles="mt-5"
              keyboardType="email-address"
              placeholder="Enter your email address"
              titleStyle={{ color: 'black' }}
            />

            <FormCustom
              title="Password"
              value={form.password}
              handleChangeText={(text) => setForm({ ...form, password: text })}
              otherStyles="mt-5"
              placeholder="Enter your password"
              secureTextEntry={true}
              titleStyle={{ color: 'black' }}
            />

            <ButtonCustom
              title={submitting ? "Logging in..." : "Sign In"}
              handlePress={LogIn}
              containerStyles="mt-7"
              isLoading={submitting}
            />
            </View>
          

          <Text
            onPress={() => navigation.navigate('ResetPassword')}
            className="text-center text-[16px] text-[#1B627D] font-semibold underline pt-4"
          >
            Forget password?
          </Text>

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-[16px] font-pregular">
              Don't have an account yet?
            </Text>
            <Text
              onPress={() => navigation.navigate('SignUp')}
              className="text-[16px] text-[#1B627D] font-semibold underline"
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
