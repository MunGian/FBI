import React from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '../../constants/images';
import FormCustom from '../../components/FormCustom';
import ButtonCustom from '../../components/ButtonCustom';
import { supabase } from '../../services/supabase';

const SignUp = ({ navigation }) => {
  const [form, setForm] = React.useState({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const [submitting, setSubmitting] = React.useState(false);

  // Function to validate phone number format
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+60\d{9,10}$/; // Regex to match +60 followed by 9-10 digits
    return phoneRegex.test(phoneNumber);
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/; // Only allow specific domains
    return emailRegex.test(email);
  };

  const createProfile = async () => {
    const { data, error } = await supabase.from('users').insert([
      {
        username: form.username,
        firstname: form.firstName,
        lastname: form.lastName,
        phonenumber: form.phoneNumber,
        email: form.email,
        // password: form.password,
        photo_url: null,
      },
    ]);

    if (error) {
      console.error("Profile creation error:", error.message);
      Alert.alert("Profile Creation Error", error.message);
    }
  };

  const registerAndGoToHome = async () => {
    if (!form.username) {
      Alert.alert("Registration Error", "Please enter your username");
      return;
    }

    if (!form.firstName || !form.lastName) {
      Alert.alert("Registration Error", "Please enter your first name and last name");
      return;
    }

    if (!isValidPhoneNumber(form.phoneNumber)) {
      Alert.alert("Registration Error", "Please enter a valid phone number with +60 country code.");
      return;
    }

    if (!form.email || !form.password) {
      Alert.alert("Registration Error", "Please enter your email and password");
      return;
    }

    if (!isValidEmail(form.email)) {
      Alert.alert("Registration Error", "Please enter a valid email ending in @gmail.com, @yahoo.com, or @outlook.com");
      return;
    }

    setSubmitting(true);
    try {
      // Check if the username already exists
      const { data: usernameCheckData, error: usernameCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('username', form.username);

      if (usernameCheckError) {
        Alert.alert("Error", usernameCheckError.message);
        return;
      } else if (usernameCheckData.length > 0) {
        Alert.alert("Registration Error", "Username is already taken.");
        return;
      }

      // Proceed with email registration
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        Alert.alert("Registration Error", error.message);
      } else if (data.user) {
        await createProfile(); // Create user profile in 'users' table
        navigation.navigate('Main', { screen: 'Home' });
      }
    } catch (error) {
      Alert.alert("Unexpected Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <ScrollView>
        <View className="justify-center w-full min-h-[90vh] px-4 my-6">
          <Text className="text-2xl text-white mt-7 font-psemibold">
            Sign Up to {''}
            <Text className="text-[#1B627D] font-pbold">
              WasteNot
            </Text>
          </Text>

          <FormCustom
            title="Username (Do remember this!)"
            value={form.username}
            handleChangeText={(text) => setForm({ ...form, username: text })}
            otherStyles="mt-4"
            placeholder="Enter your username"
          />

          <FormCustom
            title="First Name"
            value={form.firstName}
            handleChangeText={(text) => setForm({ ...form, firstName: text })}
            otherStyles="mt-3.5"
            placeholder="Enter your first name"
          />

          <FormCustom
            title="Last Name"
            value={form.lastName}
            handleChangeText={(text) => setForm({ ...form, lastName: text })}
            otherStyles="mt-3.5"
            placeholder="Enter your last name"
          />

          <FormCustom
            title="Phone Number"
            value={form.phoneNumber}
            handleChangeText={(text) => setForm({ ...form, phoneNumber: text })}
            otherStyles="mt-3.5"
            placeholder="Enter your phone number (e.g., +60123456789)"
          />

          <FormCustom
            title="Email"
            value={form.email}
            handleChangeText={(text) => setForm({ ...form, email: text })}
            otherStyles="mt-3.5"
            keyboardType="email-address"
            placeholder="Enter your email address"
          />

          <FormCustom
            title="Password"
            value={form.password}
            handleChangeText={(text) => setForm({ ...form, password: text })}
            otherStyles="mt-3.5"
            placeholder="Enter your password"
            secureTextEntry
          />

          <ButtonCustom
            title={submitting ? "Submitting..." : "Sign Up"}
            handlePress={registerAndGoToHome}
            containerStyles="mt-6"
            isLoading={submitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-[16px] font-pregular">
              Have an account already?
            </Text>
            <Text
              onPress={() => navigation.navigate('SignIn')}
              className="text-[16px] text-[#1B627D] font-semibold underline"
            >
              Sign In
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
