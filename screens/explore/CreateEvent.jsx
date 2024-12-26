import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import * as ImagePicker from 'react-native-image-picker';

const CreateEvent = ({ navigation }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventDescription, setEventDescription] = useState('');
  const [eventPhotoUrl, setEventPhotoUrl] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      setEventPhotoUrl(result.assets[0].uri);
    }
  };

  // Handle Form Submission
const handleSubmit = async () => {

    // Check for empty fields
    if (
        !eventTitle.trim() ||
        !eventDate ||
        !eventDescription.trim() ||
        !eventPhotoUrl ||
        !eventUrl 
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
    //   console.log(user);

      // Insert into the donation table
      const { error: donationError } = await supabase
        .from('event')
        .insert([
          {
            eventtitle: eventTitle,
            eventdate: eventDate.toISOString().split('T')[0],
            eventurl: eventUrl,
            eventdescription: eventDescription,
            eventphotourl: eventPhotoUrl,
            email: user.email,
          },
        ]);
  
      if (donationError) throw donationError;
  
      Alert.alert('Success', 'event posted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to post event: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Post New event</Text>
          
          <FormCustom
            title="event Title"
            handleChangeText={setEventTitle}
            otherStyles="mt-3.5"
            placeholder="Enter your event title"
            value={eventTitle}
          />

         <Text className="text-base text-white font-pmedium mt-4">Event Date:</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="mt-2 p-4 bg-white rounded-lg h-16 px-4 border-2 border-black-100 rounded-2xl focus:border-[#1B627D]"
          >
            <Text className="text-[#7b7b8b] font-psemibold text pt-1">{eventDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display="default"
              minimumDate={new Date()} // Disable dates before today
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                    setEventDate(selectedDate);
                  }
              }}
            />
          )}

         <FormCustom
            title="event Link (URL)"
            handleChangeText={setEventUrl}
            otherStyles="mt-3.5"
            placeholder="Enter the event link (URL)"
            value={eventUrl}
          />
        
          <Text className="text-base text-white font-pmedium mt-4">event Thumbnail:</Text>
          <TouchableOpacity
            onPress={selectImage}
            className="mt-2 p-3 bg-white rounded-lg flex-row items-center"
          >
             <Text className="text-[#7b7b8b] font-psemibold text pt-1 pl-1.5">{eventPhotoUrl ? 'Change Thumbnail' : 'Select Thumbnail'}</Text>
          </TouchableOpacity>
          {eventPhotoUrl && (
            <RNImage
              source={{ uri: eventPhotoUrl }}
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
            />
          )}

          <FormCustom
            title="event Description"
            handleChangeText={setEventDescription}
            otherStyles="mt-3.5"
            placeholder="Enter the event description"
            value={eventDescription}
          />

          <ButtonCustom
            title={submitting ? 'Submitting...' : 'Post New event'}
            handlePress={handleSubmit}
            containerStyles="mt-4"
            isLoading={submitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEvent;
