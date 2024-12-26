import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import picker
import DateTimePicker from '@react-native-community/datetimepicker'; 
import * as ImagePicker from 'react-native-image-picker'; // Import image picker
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';

const EditEventScreen = ({ route, navigation }) => {
  const { eventDetail } = route.params;
  const [eventTitle, setEventTitle] = useState(eventDetail.eventtitle);
  const [eventDate, setEventDate] = useState(new Date(eventDetail.eventdate));
  const [eventDescription, setEventDescription] = useState(eventDetail.eventdescription);
  const [eventPhotoUrl, setEventPhotoUrl] = useState(eventDetail.eventphotourl);
  const [eventUrl, setEventUrl] = useState(eventDetail.eventurl);
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    // Destructure the first asset if available, otherwise use a default image
    const [firstAsset] = result?.assets || [];
      
    if (firstAsset && firstAsset.uri) {
      // Ensure the URI is a string
      setEventPhotoUrl(String(firstAsset.uri)) // Convert URI to string if necessary
    }
    else {
      setEventUrl(eventPhotoUrl);
    }
  };

  const handleUpdate = async () => {
    if (!eventTitle || !eventDescription || !eventPhotoUrl || !eventUrl) {
      Alert.alert("Edit Food Details Error", "Please ensure all fields are filled in before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('event')
        .update({
          eventtitle: eventTitle,
          eventdate: eventDate.toISOString().split('T')[0],
          eventdescription: eventDescription,
          eventphotourl: eventPhotoUrl,
          eventurl: eventUrl,
        })
        .eq('eventid', eventDetail.eventid);

      if (error) throw error;

      Alert.alert('Success', 'Event details updated successfully!');
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Error', `Failed to update event details: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Edit Event Details</Text>
          <FormCustom
            title="Event Title"
            handleChangeText={setEventTitle}
            otherStyles="mt-3.5"
            placeholder="Enter the event title"
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
              minimumDate={new Date()}
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setEventDate(selectedDate);
              }}
            />
          )}

         <FormCustom
            title="Event Link (URL)"
            handleChangeText={setEventUrl}
            otherStyles="mt-3.5"
            placeholder="Enter the event link (URL)"
            value={eventUrl}
          />

          <Text className="text-base text-white font-pmedium mt-4">Event Thumbnail:</Text>
          <TouchableOpacity
            onPress={selectImage}
            className="mt-2 p-3 bg-white rounded-lg flex-row items-center"
          >
            <Text className="text-[#7b7b8b] font-psemibold text pt-1">{eventPhotoUrl ? 'Change Thumbnail' : 'Select Thumbnail'}</Text>
          </TouchableOpacity>
          {eventPhotoUrl && (
            <RNImage
              source={{ uri: eventPhotoUrl }}
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
            />
          )}

          <FormCustom
            title="Event Description"
            handleChangeText={setEventDescription}
            otherStyles="mt-3.5"
            placeholder="Enter the event description"
            value={eventDescription}
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

export default EditEventScreen;
