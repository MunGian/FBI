import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Image as RNImage, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase'; 
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';

const DonationDetails = ({ route }) => {
  const { donation } = route.params;
  const navigation = useNavigation();

  // State for additional data
  const [donorFirstName, setDonorFirstName] = useState('');
  const [donorLastName, setDonorLastName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPhoto, setDonorPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recipientFirstName, setRequestFirstName] = useState('');
  const [recipientLastName, setRequestLastName] = useState('');
  const [recipientPhone, setRequestPhone] = useState('');
  const [recipientPhoto, setRequestPhoto] = useState('');
  
  const fetchRecipientDetails = async () => {
    try {
      if (!donation?.recipientemail) {
        console.error('Missing recipient email:', donation?.recipientemail);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phonenumber, firstname, lastname, photo_url')
        .eq('email', donation.recipientemail)
        .single();

      if (userError) throw userError;

      setRequestFirstName(userData.firstname);
      setRequestLastName(userData.lastname);
      setRequestPhone(userData.phonenumber);
      setRequestPhoto(userData.photo_url);
    } catch (error) {
      console.error('Error fetching recipient details:', error);
    }
  };

  const fetchDonorDetails = async () => {
    try {
      if (!donation?.foodid) {
        console.error('Missing food ID:', donation?.foodid);
        return;
      }

      const { data: donationData, error: donationError } = await supabase
        .from('donation')
        .select('donoremail')
        .eq('foodid', donation.foodid)
        .single();

      if (donationError) throw donationError;

      const donorEmail = donationData?.donoremail;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phonenumber, firstname, lastname, photo_url')
        .eq('email', donorEmail)
        .single();

      if (userError) throw userError;

      setDonorFirstName(userData.firstname);
      setDonorLastName(userData.lastname);
      setDonorPhone(userData.phonenumber);
      setDonorPhoto(userData.photo_url);
    } catch (error) {
      console.error('Error fetching donor details:', error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      await Promise.all([fetchDonorDetails(), fetchRecipientDetails()]);
      setLoading(false);
    };

    fetchDetails();
  }, [donation]); // Include `donation` in the dependency array

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

  return (
    <SafeAreaView className="bg-neutral-200 h-full w-full relative">
        <ScrollView className="">
          <View className="bg-[#fff] h-20 flex-row items-center justify-between px-7">
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

            <Text className="text-xl font-psemibold text-black-200 pl-[25%]">
                {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(donation.receiptdate))}, {new Date(donation.receiptdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </Text>
          </View>

          <Text className="text-xl font-psemibold text-black-200 mb-3 mt-3 ml-5">
              Receipt ID: {donation.receiptid}
          </Text>

          {/* Donation Details Box */}
          <View className="bg-white p-5 pb-1 rounded-lg shadow-lg mb-2 z-0">
          <Text className="text-xl font-pbold text-[#1B627D] mb-2">
              Donation Details
            </Text>
            <Text className="text-base font-psemibold text-black-200 mb-2">
              Food Name: {" "}
              <Text className="text-md font-pmedium text-gray-700 mb-2">
                {donation.foodname}
              </Text>
            </Text>
            {/* <Image
                source={{ uri: donation.foodphoto_url }}
                className="w-full h-64 rounded-lg mb-4"
                resizeMode="cover"
            /> */}
            <Text className="text-base font-psemibold text-black-200 mb-2">
              Category: {" "}
              <Text className="text-md font-pmedium text-gray-700 mb-2">
                {donation.category}
              </Text>
            </Text>
            <Text className="text-base font-psemibold text-gray-700 mb-2">
                Receipt Date:{" "}
                <Text className="text-sm font-pmedium">
                {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(donation.receiptdate))}, {new Date(donation.receiptdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </Text>
            </Text>
            <Text className="text-base font-psemibold text-gray-700 mb-2">
                Quantity:{" "}
                <Text className="text-sm font-pmedium">{donation.quantity}</Text>
            </Text>

            {/* Address with clickable link to Google Maps */}
            <Text className="text-base font-psemibold text-gray-700">Address: </Text>
            <TouchableOpacity onPress={() => openGoogleMaps(donation.address)}>
            <Text className="text-md font-pmedium text-[#1B627D] mb-2">
                {donation.address}
            </Text>
            </TouchableOpacity>
            
            <Text className="text-base font-psemibold text-gray-700">District: </Text>
            <Text className="text-md font-pmedium text-gray-700 mb-2">
                {donation.district}
            </Text>
          </View>
            
             {/* Conditional Rendering: Donor Info or Edit Food Button (for donor only in create tab) */}
          {donation.type === "recipient" ? (
             <View>
             <>
               {/* request Information Box */}
               <View className="bg-white p-6 pt-2 pb-2 rounded-lg shadow-lg items-center flex-row">
                 <View>
                   <Image
                     source={donorPhoto ? { uri: donorPhoto } : icons.defaultUserIcon} // Use default image if profileImage is empty or invalid
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
                   openWhatsApp(recipientPhone);
                   setSubmitting(false);
                 }}
                 containerStyles="m-2"
                 isLoading={submitting}
               />
             </>
           </View>
          ) : (
            <View>
            <>
              {/* request Information Box */}
              <View className="bg-white p-6 pt-2 pb-2 rounded-lg shadow-lg items-center flex-row">
                <View>
                  <Image
                    source={recipientPhoto ? { uri: recipientPhoto } : icons.defaultUserIcon} // Use default image if profileImage is empty or invalid
                    className="w-24 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                <View className="ml-4 pt-2">
                  <Text className="text-base font-psemibold text-gray-700">
                    Recipient Name:
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700 mb-1.5">
                    {recipientFirstName && recipientLastName
                      ? `${recipientFirstName} ${recipientLastName}`
                      : 'N/A'}
                  </Text>
                  <Text className="text-base font-psemibold text-gray-700">
                    Recipient Phone Number:
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700">
                    {recipientPhone || 'N/A'}
                  </Text>
                </View>
              </View>

              <ButtonCustom
                title={submitting ? 'Redirecting...' : 'Contact Recipient'}
                handlePress={() => {
                  setSubmitting(true);
                  openWhatsApp(recipientPhone);
                  setSubmitting(false);
                }}
                containerStyles="m-2"
                isLoading={submitting}
              />
            </>
          </View>
        )}
        </ScrollView>
    </SafeAreaView>
  );
};

export default DonationDetails;
