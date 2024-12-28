import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Image as RNImage, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase'; 
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';

const RequestDetail = ({ route }) => {
  const { requestItem } = route.params;
  const navigation = useNavigation();

  // State for additional data
  const [requestEmail, setRequestEmail] = useState('');
  const [requestFirstName, setRequestFirstName] = useState('');
  const [requestLastName, setRequestLastName] = useState('');
  const [requestPhone, setRequestPhone] = useState('');
  const [requestPhoto, setRequestPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState('request');

  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!requestItem?.requestid) {
        console.error('Invalid requestItem.id:', requestItem?.requestid);
        return;
      }
  
      try {
        const { data: requestData, error: requestError } = await supabase
          .from('request')
          .select('requestemail')
          .eq('requestid', requestItem.requestid)
          .single();
        
        if (requestError) throw requestError;

        const requestEmail = requestData?.requestemail;
  
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, phonenumber, firstname, lastname, photo_url')
          .eq('email', requestEmail)
          .single();
  
        if (userError) throw userError;
        // console.log('request Data:', userData);
        setRequestEmail(userData.email);
        setRequestFirstName(userData.firstname);
        setRequestLastName(userData.lastname);
        setRequestPhone(userData.phonenumber);
        setRequestPhoto(userData.photo_url);
      } catch (error) {
        console.error('Error fetching request details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequestDetails();
  }, [requestItem?.requestid]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#50C878" />
      </View>
    );
  }

  const openWhatsApp = (phoneNumber) => {
    // Format the phone number (in international format)
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const whatsappUrl = `https://wa.me/${formattedNumber}`;
  
    // Open the WhatsApp URL (mobile app or WhatsApp Web)
    Linking.openURL(whatsappUrl)
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        alert('Unable to open WhatsApp. Please make sure it is installed.');
      });
  };
  

  // Function to open Google Maps with the address
  const openGoogleMaps = (address) => {
    // Format the address to be used in a Google Maps URL
    const encodedAddress = encodeURIComponent(address);
    
    // For web
    const googleMapsUrl = `https://www.google.com/maps?q=${encodedAddress}`;

    // For mobile app 
    const googleMapsAppUrl = `google.navigation:q=${encodedAddress}`;

    // Check if Google Maps is available, and open the app URL else open in web browser
    Linking.canOpenURL(googleMapsAppUrl).then((supported) => {
        if (supported) {
        Linking.openURL(googleMapsAppUrl);
        } else {
        Linking.openURL(googleMapsUrl);
        }
    }).catch((err) => {
        console.error("Error opening Google Maps: ", err);
    });
  };

  // Delete Request 
  const deleteRequest = async (requestid) => {
    try {
      if (!requestid) {
        console.error('Invalid request ID:', requestid);
        return;
      }

      // Delete the food item from the 'requestItem' table
      const { error } = await supabase
        .from('request')
        .delete()
        .eq('requestid', requestid);

      if (error) throw error;

      Alert.alert('Success', 'Request deleted successfully.');
      // navigation.goBack(); // Navigate back to the previous screen
    } catch (err) {
      console.error('Error deleting request:', err.message);
      Alert.alert('Error', 'Failed to delete request. Please try again.');
    }
  };

  return (
    <SafeAreaView className="bg-neutral-200 h-full w-full relative">
        <ScrollView className="">
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

            {/* Food Details Box */}
            <View className="bg-white p-5 pb-1 rounded-lg shadow-lg mb-2 z-0">
                <Text className="text-2xl font-pextrabold text-[#50C878] mb-3 mt-12">
                    Requested Food:{'\n'}
                    <Text className="font-pbold text-[#50C878]">
                      {requestItem.requestname}
                    </Text>
                </Text>

                <Text className="text-xl font-pbold text-gray-700 mb-2">Category: {requestItem.category}</Text>
                
                <Text className="text-base font-pmedium text-gray-700 mb-2">
                    <Text className="font-psemibold">Posted Date: </Text>
                    {requestItem.requestdate
                        ? new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        }).format(new Date(requestItem.requestdate))
                        : 'N/A'}
                </Text>

                <Text className="text-base font-psemibold text-gray-700 mb-2">
                    Quantity:{" "}
                    <Text className="text-sm font-pmedium">{requestItem.quantity}</Text>
                </Text>

                {/* Address with clickable link to Google Maps */}
                <Text className="text-base font-psemibold text-gray-700">Address: </Text>
                <TouchableOpacity onPress={() => openGoogleMaps(requestItem.address)}>
                <Text className="text-md font-pmedium text-[#1B627D] mb-2">
                    {requestItem.address}
                </Text>
                </TouchableOpacity>
                
                <Text className="text-base font-psemibold text-gray-700">District: </Text>
                <Text className="text-md font-pmedium text-gray-700 mb-2">
                    {requestItem.district}
                </Text>
                <Text className="text-base font-psemibold text-gray-700">Description: </Text>
                <Text className="text-md font-pmedium text-gray-700 mb-2">
                    {requestItem.description}
                </Text>
            </View>
            
            {/* Conditional Rendering: request Info or Edit Food Button (for request only in create tab) */}
          {requestItem.type === 'request' ? (
            <>
              {/* request Information Box */}
              <View className="bg-white p-6 pt-2 pb-2 rounded-lg shadow-lg items-center flex-row">
                <View>
                  <Image
                    source={{ uri: requestPhoto }}
                    className="w-24 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                <View className="ml-4 pt-2">
                  <Text className="text-base font-psemibold text-gray-700">
                    Requester Name:
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700 mb-1.5">
                    {requestFirstName && requestLastName
                      ? `${requestFirstName} ${requestLastName}`
                      : 'N/A'}
                  </Text>
                  <Text className="text-base font-psemibold text-gray-700">
                    Requester Phone Number:
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700">
                    {requestPhone || 'N/A'}
                  </Text>
                </View>
              </View>

              <ButtonCustom
                title={submitting ? 'Redirecting...' : 'Contact Requester'}
                handlePress={() => {
                  setSubmitting(true);
                  openWhatsApp(requestPhone);
                  setSubmitting(false);
                }}
                containerStyles="m-2"
                isLoading={submitting}
              />
            </>
          ) : (
            <View>
            {/* Edit Food Button */}
            <ButtonCustom
              title={submitting ? 'Redirecting...' : 'Edit Request Details'}
              handlePress={() => {
                setSubmitting(true);
                navigation.navigate('EditRequestDetail', { requestItem });
                setSubmitting(false);
              }}
              containerStyles="m-2"
              isLoading={submitting}
            />
        
            {/* Delete Food Button */}
            <ButtonCustom
              title={submitting ? 'Deleting...' : 'Delete Request'}
              handlePress={() => {
                Alert.alert(
                  'Delete Confirmation',
                  'Are you sure you want to delete this request? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        setSubmitting(true);
                        await deleteRequest(requestItem.requestid); // Pass the food ID to delete
                        setSubmitting(false);
                        navigation.goBack(); // Navigate back to the previous screen
                      },
                    },
                  ]
                );
              }}
              containerStyles="m-2 bg-[#8B0000]"
              isLoading={submitting}
            />

            {/* Complete Food Button */}
            <ButtonCustom
              title={submitting ? 'Redirecting...' : 'Complete Request'}
              handlePress={() => {
                setSubmitting(true);
                navigation.navigate('CompleteDetails', { requestItem, requestEmail, type });
                setSubmitting(false);
              }}
              containerStyles="m-2 mt-1 bg-[#2FBE2F]"
              isLoading={submitting}
            />
          </View>
        )}
        </ScrollView>
    </SafeAreaView>
  );
};

export default RequestDetail;
