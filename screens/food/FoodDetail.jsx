import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Image as RNImage, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase'; 
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';

const FoodDetailScreen = ({ route }) => {
  const { foodItem } = route.params;
  const navigation = useNavigation();

  // State for additional data
  const [donorEmail, setDonorEmail] = useState('');
  const [donorFirstName, setDonorFirstName] = useState('');
  const [donorLastName, setDonorLastName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPhoto, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const type = 'donor';
  
  // Fetch donor details
  useEffect(() => {
    const fetchDonorDetails = async () => {
      if (!foodItem?.foodid) {
        console.error('Invalid foodItem.id:', foodItem?.foodid);
        return;
      }
  
      try {
        const { data: donationData, error: donationError } = await supabase
          .from('donation')
          .select('donoremail')
          .eq('foodid', foodItem.foodid)
          .single();
  
        if (donationError) throw donationError;
  
        const donorEmail = donationData?.donoremail;
  
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email, phonenumber, firstname, lastname, photo_url')
          .eq('email', donorEmail)
          .single();
  
        if (userError) throw userError;
        // console.log('Donor Data:', userData);
        setDonorEmail(userData.email);
        setDonorFirstName(userData.firstname);
        setDonorLastName(userData.lastname);
        setDonorPhone(userData.phonenumber);
        setPhoto(userData.photo_url);
      } catch (error) {
        console.error('Error fetching donor details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDonorDetails();
  }, [foodItem?.foodid]);

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

  // Delete Food 
  const deleteFood = async (foodId) => {
    try {
      if (!foodId) {
        console.error('Invalid food ID:', foodId);
        return;
      }

      // Delete the food item from the 'fooditem' table
      const { error } = await supabase
        .from('fooditem')
        .delete()
        .eq('foodid', foodId);

      if (error) throw error;

      // console.log('Food item deleted successfully');
      Alert.alert('Success', 'Food item deleted successfully.');
      // navigation.goBack(); // Navigate back to the previous screen
    } catch (err) {
      console.error('Error deleting food item:', err.message);
      Alert.alert('Error', 'Failed to delete food item. Please try again.');
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
                <Text className="text-2xl font-pbold text-[#50C878] mb-3 mt-12">
                    {foodItem.foodname}
                </Text>
                <Image
                    source={{ uri: foodItem.foodphoto_url }}
                    className="w-full h-64 rounded-lg mb-4"
                    resizeMode="cover"
                />
                <Text className="text-xl font-pbold text-gray-700 mb-2">Category: {foodItem.category}</Text>
                <Text className="text-base font-pmedium text-gray-700 mb-2">
                    <Text className="font-psemibold">Expiry Date: </Text>
                    {foodItem.expirydate
                        ? new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        }).format(new Date(foodItem.expirydate))
                        : 'N/A'}
                </Text>
                <Text className="text-base font-psemibold text-gray-700 mb-2">
                    Quantity:{" "}
                    <Text className="text-sm font-pmedium">{foodItem.quantity}</Text>
                </Text>

                {/* Address with clickable link to Google Maps */}
                <Text className="text-base font-psemibold text-gray-700">Address: </Text>
                <TouchableOpacity onPress={() => openGoogleMaps(foodItem.address)}>
                <Text className="text-md font-pmedium text-[#1B627D] mb-2">
                    {foodItem.address}
                </Text>
                </TouchableOpacity>
                
                <Text className="text-base font-psemibold text-gray-700">District: </Text>
                <Text className="text-md font-pmedium text-gray-700 mb-2">
                    {foodItem.district}
                </Text>
                <Text className="text-base font-psemibold text-gray-700">Description: </Text>
                <Text className="text-md font-pmedium text-gray-700 mb-2">
                    {foodItem.description}
                </Text>
            </View>
            
             {/* Conditional Rendering: Donor Info or Edit Food Button (for donor only in create tab) */}
          {foodItem.food === 'available' ? (
            <>
              {/* Donor Information Box */}

            <View className="bg-white p-6 pt-2 pb-2 rounded-lg shadow-lg items-center flex-row">
                <View>
                  <Image
                    source={donorPhoto ? { uri: donorPhoto } : icons.defaultUserIcon}
                    className="w-24 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                
                <View className="ml-4 pt-2">
                  <Text className="text-base font-psemibold text-gray-700">
                     Donor Name:
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700 mb-1.5">
                    {donorFirstName && donorLastName
                      ? `${donorFirstName} ${donorLastName}`
                      : 'N/A'}
                  </Text>
                  <Text className="text-base font-psemibold text-gray-700">
                     Donor Phone Number:
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700">
                    {donorPhone || 'N/A'}
                  </Text>
                </View>
              </View>

              <ButtonCustom
                title={submitting ? 'Redirecting...' : 'Contact Donor'}
                handlePress={() => {
                  setSubmitting(true);
                  openWhatsApp(donorPhone);
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
              title={submitting ? 'Redirecting...' : 'Edit Food Details'}
              handlePress={() => {
                setSubmitting(true);
                navigation.navigate('EditFoodDetail', { foodItem });
                setSubmitting(false);
              }}
              containerStyles="m-2"
              isLoading={submitting}
            />
        
            {/* Delete Food Button */}
            <ButtonCustom
              title={submitting ? 'Deleting...' : 'Delete Food'}
              handlePress={() => {
                Alert.alert(
                  'Delete Confirmation',
                  'Are you sure you want to delete this food item? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        setSubmitting(true);
                        await deleteFood(foodItem.foodid); // Pass the food ID to delete
                        setSubmitting(false);
                        navigation.goBack(); // Navigate back to the previous screen
                      },
                    },
                  ]
                );
              }}
              containerStyles="m-2 mt-1 bg-[#8B0000]"
              isLoading={submitting}
            />

            {/* Complete Food Button */}
            <ButtonCustom
              title={submitting ? 'Redirecting...' : 'Complete Donation'}
              handlePress={() => {
                setSubmitting(true);
                navigation.navigate('CompleteDetails', { foodItem, donorEmail, type });
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

export default FoodDetailScreen;
