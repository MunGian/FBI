import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const CreateFoodDetail = ({ navigation }) => {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [quantity, setQuantity] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Fruits', 'Vegetables', 'Fast Food', 'Dairy', 'Meat', 'Others'];
  const districts = ['Balik Pulau', 'Bayan Lepas', 'Bayan Baru', 'Gertak Sanggul', 'Pantai Acheh', 'Permatang Damar Laut', 'Sungai Ara', 
                    'Teluk Kumbar', 'George Town', 'Batu Feringghi', 'Tanjung Tokong', 'Pulau Tikus', 'Batu Lanchang', 'Air Itam', 
                    'Paya Terubong', 'Jelutong', 'Gelugor'];
  
  // Handle Image Selection
  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
    //   console.log('Image selection cancelled');
    } else if (result.errorMessage) {
    //   console.error('Image Picker Error:', result.errorMessage);
    } else if (result.assets && result.assets[0]?.uri) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  // Handle Form Submission
const handleSubmit = async () => {

    // Check for empty fields
    if (
        !foodName.trim() ||
        !category.trim() ||
        !expiryDate ||
        !quantity.trim() ||
        !photoUrl ||
        !address.trim() ||
        !district.trim() ||
        !description.trim()
    ) {
        Alert.alert('Error', 'Please fill out all fields before submitting.');
        return;
    }

    try {
      setSubmitting(true);
  
      // Insert into the 'fooditem' table
      const { data: foodData, error: foodError } = await supabase
        .from('fooditem')
        .insert([
          {
            foodname: foodName,
            category,
            expirydate: expiryDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            quantity: parseInt(quantity, 10),
            foodphoto_url: photoUrl,
            address,
            district,
            description,
          },
        ])
        .select(); // Ensure we fetch the inserted row(s)
  
      if (foodError) throw foodError;
  
      const newFoodId = foodData[0].foodid; // Retrieve the inserted foodid
  
      // Fetch the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError) throw userError;
  
      // Insert into the donation table
      const { error: donationError } = await supabase
        .from('donation')
        .insert([
          {
            foodid: newFoodId,
            donoremail: user.email,
            donationdate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
          },
        ]);
  
      if (donationError) throw donationError;
  
      Alert.alert('Success', 'Food item posted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to add food item: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Create New Food Donation</Text>
          
          <FormCustom
            title="Food Name"
            handleChangeText={setFoodName}
            otherStyles="mt-3.5"
            placeholder="Enter your food name"
            value={foodName}
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

          <Text className="text-base text-white font-pmedium mt-4">Expiry Date:</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="mt-2 p-4 bg-white rounded-lg h-16 px-4 border-2 border-black-100 rounded-2xl focus:border-[#1B627D]"
          >
            <Text className="text-[#7b7b8b] font-psemibold text pt-1">{expiryDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              minimumDate={new Date()} // Disable dates before today
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                    setExpiryDate(selectedDate);
                  }
              }}
            />
          )}

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
            placeholder="Enter your food quantity"
            value={quantity}
            keyboardType="numeric"
            />

          <Text className="text-base text-white font-pmedium mt-4">Food Photo:</Text>
          <TouchableOpacity
            onPress={selectImage}
            className="mt-2 p-3 bg-white rounded-lg flex-row items-center"
          >
             <Text className="text-[#7b7b8b] font-psemibold text pt-1 pl-1.5">{photoUrl ? 'Change Photo' : 'Select Photo'}</Text>
          </TouchableOpacity>
          {photoUrl && (
            <RNImage
              source={{ uri: photoUrl }}
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
            />
          )}

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
            placeholder="Enter your food Description"
            value={description}
          />

          <ButtonCustom
            title={submitting ? 'Submitting...' : 'Post New Food'}
            handlePress={handleSubmit}
            containerStyles="mt-4"
            isLoading={submitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateFoodDetail;
