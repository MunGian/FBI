import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import picker
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';

const EditFoodScreen = ({ route, navigation }) => {
  const { requestItem } = route.params;
  const [requestName, setRequestName] = useState(requestItem.requestname);
  const [category, setCategory] = useState(requestItem.category);
  const [quantity, setQuantity] = useState(requestItem.quantity.toString());
  const [address, setAddress] = useState(requestItem.address);
  const [district, setDistrict] = useState(requestItem.district);
  const [description, setDescription] = useState(requestItem.description);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Fruits', 'Vegetables', 'Fast Food', 'Dairy', 'Meat', 'Others'];
  const districts = ['Balik Pulau', 'Bayan Lepas', 'Bayan Baru', 'Gertak Sanggul', 'Pantai Acheh', 'Permatang Damar Laut', 'Sungai Ara', 
    'Teluk Kumbar', 'George Town', 'Batu Feringghi', 'Tanjung Tokong', 'Pulau Tikus', 'Batu Lanchang', 'Air Itam', 
    'Paya Terubong', 'Jelutong', 'Gelugor'];


  const handleUpdate = async () => {
    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('request')
        .update({
          requestname: requestName,
          requestcategory: category,
          requestquantity: parseInt(quantity, 10),
          requestaddress: address,
          requestdistrict: district,
          requestdescription: description,
        })
        .eq('requestid', requestItem.requestid);

      if (error) throw error;

      Alert.alert('Success', 'Request details updated successfully!');
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Error', `Failed to update request details: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Edit Request Details</Text>
          <FormCustom
            title="Food Name"
            handleChangeText={setRequestName}
            otherStyles="mt-3.5"
            placeholder="Food Name"
            value={requestName}
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
