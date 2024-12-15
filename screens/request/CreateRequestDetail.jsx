import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';
import { Picker } from '@react-native-picker/picker';

const CreateRequestDetail = ({ navigation }) => {
  const [requestName, setrequestName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Fruits', 'Vegetables', 'Fast Food', 'Dairy', 'Meat', 'Others'];
  const districts = ['Balik Pulau', 'Bayan Lepas', 'Bayan Baru', 'Gertak Sanggul', 'Pantai Acheh', 'Permatang Damar Laut', 'Sungai Ara', 
                    'Teluk Kumbar', 'George Town', 'Batu Feringghi', 'Tanjung Tokong', 'Pulau Tikus', 'Batu Lanchang', 'Air Itam', 
                    'Paya Terubong', 'Jelutong', 'Gelugor'];
  

// Handle Form Submission
const handleSubmit = async () => {

    // Check for empty fields
    if (
        !requestName.trim() ||
        !category.trim() ||
        !quantity.trim() ||
        !address.trim() ||
        !district.trim() ||
        !description.trim()
    ) {
        Alert.alert('Error', 'Please fill out all fields before submitting.');
        return;
    }

    try {
      setSubmitting(true);
  
      // Fetch the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError) throw userError;

      // Insert into the 'request' table
      const { data: requestData, error: requestError } = await supabase
        .from('request')
        .insert([
          {
            requestname: requestName,
            requestemail: user.email,
            requestcategory: category,
            requestquantity: parseInt(quantity, 10),
            requestaddress: address,
            requestdistrict: district,
            requestdescription: description,
          },
        ])
        .select(); // Ensure we fetch the inserted row(s)
  
      if (requestError) throw requestError;

      Alert.alert('Success', 'Food request posted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to post food request: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView className="bg-[#50C878] h-full">
      <ScrollView>
        {/* Back Button */}
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
          <Text className="text-2xl text-white font-pbold mb-2">Create New Food Request</Text>
          
          <FormCustom
            title="Request Name"
            handleChangeText={setrequestName}
            otherStyles="mt-3.5"
            placeholder="Enter your requested food name"
            value={requestName}
          />

        <Text className="text-base text-white font-pmedium mt-4">Category:</Text>
        <View className="mt-2 pl-2 bg-white border-2 border-black-100 rounded-2xl">
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={{ color: '#4B5563', fontSize: 14, fontWeight: '700' }}
            >
                <Picker.Item label="Select Category" value="" />
                {categories.map((cat, index) => (
                <Picker.Item key={index} label={cat} value={cat} />
                ))}
            </Picker>
        </View>

        <FormCustom
            title="Quantity"
            handleChangeText={(value) => {
                const numericValue = parseInt(value, 10); // Parse the value as an integer
                if (!isNaN(numericValue)) {
                setQuantity(numericValue.toString()); // Store it as a string for the input
                } else {
                setQuantity(''); // Clear the value if it's not a valid number
                }
            }}
            otherStyles="mt-3.5"
            placeholder="Enter your requested food quantity"
            value={quantity}
            keyboardType="numeric"
        />

        <FormCustom
            title="Address"
            handleChangeText={setAddress}
            otherStyles="mt-3.5"
            placeholder="Enter your address"
            value={address}
        />

        <Text className="text-base text-white font-pmedium mt-4">District:</Text>
          <View className="mt-2 pl-2 bg-white border-2 border-black-100 rounded-2xl">
            <Picker
              selectedValue={district}
              onValueChange={(itemValue) => setDistrict(itemValue)}
              style={{ color: '#4B5563', fontSize: 14, fontWeight: '700' }} // Apply styling here
            >
              <Picker.Item label="Select District" value="" />
              {districts.map((dist, index) => (
                <Picker.Item key={index} label={dist} value={dist} style={{ fontSize: 14, color: '#4B5563', fontWeight: '700' }}/>
              ))}
            </Picker>
          </View>

          <FormCustom
            title="Description"
            handleChangeText={setDescription}
            otherStyles="mt-3.5"
            placeholder="Enter your request Description"
            value={description}
          />

          <ButtonCustom
            title={submitting ? 'Submitting...' : 'Post New Request'}
            handlePress={handleSubmit}
            containerStyles="mt-4"
            isLoading={submitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRequestDetail;
