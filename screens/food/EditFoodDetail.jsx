import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import picker
import DateTimePicker from '@react-native-community/datetimepicker'; 
import * as ImagePicker from 'react-native-image-picker'; // Import image picker
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';

const EditFoodScreen = ({ route, navigation }) => {
  const { foodItem } = route.params;
  const [foodName, setFoodName] = useState(foodItem.foodname);
  const [category, setCategory] = useState(foodItem.category);
  const [quantity, setQuantity] = useState(foodItem.quantity.toString());
  const [address, setAddress] = useState(foodItem.address);
  const [district, setDistrict] = useState(foodItem.district);
  const [description, setDescription] = useState(foodItem.description);
  const [expiryDate, setExpiryDate] = useState(new Date(foodItem.expirydate));
  const [photoUrl, setPhotoUrl] = useState(foodItem.foodphoto_url);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Fruits', 'Vegetables', 'Fast Food', 'Dairy', 'Meat', 'Others'];
  const districts = ['Balik Pulau', 'Bayan Lepas', 'Bayan Baru', 'Gertak Sanggul', 'Pantai Acheh', 'Permatang Damar Laut', 'Sungai Ara', 
    'Teluk Kumbar', 'George Town', 'Batu Feringghi', 'Tanjung Tokong', 'Pulau Tikus', 'Batu Lanchang', 'Air Itam', 
    'Paya Terubong', 'Jelutong', 'Gelugor'];

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('fooditem')
        .update({
          foodname: foodName,
          category,
          quantity: parseInt(quantity, 10),
          address,
          district,
          description,
          expirydate: expiryDate.toISOString().split('T')[0],
          foodphoto_url: photoUrl,
        })
        .eq('foodid', foodItem.foodid);

      if (error) throw error;

      Alert.alert('Success', 'Food details updated successfully!');
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Error', `Failed to update food details: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Edit Food Details</Text>
          <FormCustom
            title="Food Name"
            handleChangeText={setFoodName}
            otherStyles="mt-3.5"
            placeholder="Food Name"
            value={foodName}
          />
        
          <Text className="text-base text-white font-pmedium mt-4">Category:</Text>
          <View className="mt-2 pl-2 w-full bg-white border-2 border-black-100 rounded-2xl">
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={{ color: '#4B5563', fontSize: 14, fontWeight: '700' }}
            >
              {categories.map((item, index) => (
                <Picker.Item label={item} value={item} key={index} />
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
              minimumDate={new Date()}
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setExpiryDate(selectedDate);
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
            placeholder="Food Quantity"
            value={quantity}
            keyboardType="numeric"
          />

          <Text className="text-base text-white font-pmedium mt-4">Food Photo:</Text>
          <TouchableOpacity
            onPress={selectImage}
            className="mt-2 p-3 bg-white rounded-lg flex-row items-center"
          >
            <Text className="text-[#7b7b8b] font-psemibold text pt-1">{photoUrl ? 'Change Photo' : 'Select Photo'}</Text>
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
            placeholder="Address"
            value={address}
          />

          <Text className="text-base text-white font-pmedium mt-4">District:</Text>
          <View className="mt-2 pl-2 w-full bg-white border-2 border-black-100 rounded-2xl">
            <Picker
              selectedValue={district}
              onValueChange={(itemValue) => setDistrict(itemValue)}
              style={{ color: '#4B5563', fontSize: 14, fontWeight: '700' }}
            >
              {districts.map((item, index) => (
                <Picker.Item label={item} value={item} key={index} />
              ))}
            </Picker>
          </View>

          <FormCustom
            title="Description"
            handleChangeText={setDescription}
            otherStyles="mt-3.5"
            placeholder="Food Description"
            value={description}
          />

          {/* Submit Button */}
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

export default EditFoodScreen;
