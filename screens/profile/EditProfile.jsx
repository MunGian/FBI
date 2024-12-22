import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import * as ImagePicker from 'react-native-image-picker'; // Import image picker
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';
import { fetchUserDetails } from '../supabaseAPI/api';
import { supabase } from '../../services/supabase';

const EditProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phoneNo: "",
    photo: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
  
    // Destructure the first asset if available, otherwise use a default image
    const [firstAsset] = result?.assets || [];
  
    if (firstAsset && firstAsset.uri) {
      // Ensure the URI is a string
      setUser(prevUser => ({
        ...prevUser,
        photo: String(firstAsset.uri), // Convert URI to string if necessary
      }));
    } else {
      setUser(prevUser => ({
        ...prevUser,
      }));
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await fetchUserDetails();
      setUser({
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        phoneNo: userData.phonenumber,
        photo: userData.photo_url || "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to validate phone number format
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+60\d{9,10}$/; // Regex to match +60 followed by 9-10 digits
    return phoneRegex.test(phoneNumber);
  };

  const handleUpdate = async () => {
    if (!user.firstname || !user.lastname) {
          Alert.alert("Edit Profile Error", "Please enter your first name and last name");
          return;
        }
    
    if (!isValidPhoneNumber(user.phoneNo)) {
      Alert.alert("Edit Profile Error", "Please enter a valid phone number with +60 country code.");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('users')
        .update({
          firstname: user.firstname,
          lastname: user.lastname,
          phonenumber: user.phoneNo,
          photo_url: user.photo,
        })
        .eq('email', user.email);

      if (error) throw error;

      Alert.alert('Success', 'Food details updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to update food details: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <ScrollView>
        <TouchableOpacity
          className="absolute top-4 left-4 bg-gray-300 p-3 rounded-full z-10"
          onPress={() => navigation.goBack()}
        >
          <RNImage
            source={icons.leftArrow}
            style={{ width: 24, height: 24, tintColor: '#333' }}
          />
        </TouchableOpacity>

        <View className="flex-1 p-4 pt-20">
          <Text className="text-2xl text-white font-pbold mb-2">Edit Profile Details</Text>

          <FormCustom
            title="First Name"
            handleChangeText={(text) => setUser(prevUser => ({ ...prevUser, firstname: text }))}
            otherStyles="mt-3.5"
            placeholder="Enter your first name"
            value={user.firstname}
          />

          <FormCustom
            title="Last Name"
            handleChangeText={(text) => setUser(prevUser => ({ ...prevUser, lastname: text }))}
            otherStyles="mt-3.5"
            placeholder="Enter your last name"
            value={user.lastname}
          />

          <FormCustom
            title="Phone Number"
            handleChangeText={(text) => setUser(prevUser => ({ ...prevUser, phoneNo: text }))}
            otherStyles="mt-3.5"
            placeholder="Enter your phone number (e.g., +60123456789)"
            value={user.phoneNo}
          />

          <Text className="text-base text-white font-pmedium mt-4">Food Photo:</Text>
          <TouchableOpacity
            onPress={selectImage}
            className="mt-2 p-3 bg-white rounded-lg flex-row items-center"
          >
            <Text className="text-[#7b7b8b] font-psemibold text pt-1">
              {user.photo ? 'Change Photo' : 'Select Photo'}
            </Text>
          </TouchableOpacity>
          {user.photo && (
            <RNImage
              source={{ uri: user.photo }}
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
            />
          )}

          <ButtonCustom
            title={submitting ? 'Submitting...' : 'Submit Changes'}
            handlePress={handleUpdate}
            containerStyles="mt-4"
            isLoading={submitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
