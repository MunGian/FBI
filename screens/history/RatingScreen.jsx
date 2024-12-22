import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, Image as RNImage, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase'; 
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateDonorFeedback, updateRecipientFeedback } from '../supabaseAPI/api'

const RatingScreen = ({ route }) => {
  const { donation } = route.params;
  const navigation = useNavigation();

  // State for additional data
  const [donorEmail, setDonorEmail] = useState('');
  const [donorFirstName, setDonorFirstName] = useState('');
  const [donorLastName, setDonorLastName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPhoto, setDonorPhoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientFirstName, setRequestFirstName] = useState('');
  const [recipientLastName, setRequestLastName] = useState('');
  const [recipientPhone, setRequestPhone] = useState('');
  const [recipientPhoto, setRequestPhoto] = useState('');
  
  const [rating, setRating] = useState(0); // Initialize the rating state (0-5)
  const [feedback, setFeedback] = useState(''); // Initialize the feedback state

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

      setRecipientEmail(donation.recipientemail);
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
      const donorEmail = donation.donoremail;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('phonenumber, firstname, lastname, photo_url')
        .eq('email', donorEmail)
        .single();

      if (userError) throw userError;

      setDonorEmail(donorEmail);
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

      console.log(donation.donorstatus, donation.recipientstatus);  
    };

    fetchDetails();
  }, [donation]); // Include `donation` in the dependency array

  return (
    <SafeAreaView className="bg-white h-full w-full relative">
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
            
        
          {donation.type === "recipient" ? (
             <View className="mt-20">
             <>
               {/* Recipient Information Box */}
               <View className="bg-white pt-2 pb-2 rounded-lg shadow-lg items-center">
                    <View className="items-center">
                        <Image
                        source={donorPhoto ? { uri: donorPhoto } : icons.defaultUserIcon} // Use default image if profileImage is empty or invalid
                        className="w-28 h-28 rounded-full"
                        resizeMode="cover"
                        />
                    </View>

                    <View className="pt-2 items-center">
                        <Text className="w-[270px] text-xl font-psemibold text-gray-700 mt-2 text-center">
                            Let's rate your donor's donation service
                        </Text>

                        <Text className="text-md font-pmedium text-gray-700 text-center mt-2">
                            How was the service provided by {""}
                            <Text className="text-[#1B627D] font-psemibold">
                                {donorFirstName} {donorLastName}
                            </Text>
                            ?
                        </Text>
                    </View>

                    <View className="pt-2 flex-row items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                            key={star}
                            onPress={() => setRating(star)} // Set rating on star press
                            >
                                <Image
                                    source={icons.star}
                                    style={{ width: 48, height: 48, tintColor: rating >= star ? '#FDCC0D' : 'gray' }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {rating > 0 &&  
                        <View className="pt-2">
                          <TextInput 
                            className="border border-gray-300 p-2 rounded-lg w-[380px] mt-2 font-pmedium"
                            multiline={true}
                            textAlign="left"
                            placeholder="Write your review or suggestions here..."
                            onChangeText={(text) => setFeedback(text)}
                            value={feedback}
                          />

                          <ButtonCustom
                            title={submitting ? 'Submitting...' : 'Submit Feedback'}
                            handlePress={async () => {
                                try {
                                    setSubmitting(true);
                                    await updateRecipientFeedback(donation.receiptid, recipientEmail, feedback, rating);
                                    Alert.alert("Success", "Feedback submitted successfully.");
                                    setFeedback('');
                                    setRating(0);
                                    navigation.goBack();
                                } catch (error) {
                                    Alert.alert("Error", "Failed to submit feedback. Please try again.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            containerStyles="m-2 mt-5"
                            isLoading={submitting}
                          />
                        </View>  
                    }
                </View>
             </>
           </View>
          ) : (
            <View className="mt-20">
            <>
              {/* Donor Information Box */}
              <View className="bg-white pt-2 pb-2 rounded-lg shadow-lg items-center">
                   <View className="items-center">
                       <Image
                       source={recipientPhoto ? { uri: recipientPhoto } : icons.defaultUserIcon} // Use default image if profileImage is empty or invalid
                       className="w-28 h-28 rounded-full"
                       resizeMode="cover"
                       />
                   </View>

                   <View className="pt-2 items-center">
                       <Text className="w-[270px] text-xl font-psemibold text-gray-700 mt-2 text-center mt-2">
                            Let's rate your Recipient's overall service
                       </Text>

                       <Text className="text-md font-pmedium text-gray-700 text-center">
                            How was the service provided by {""}
                            <Text className="text-[#1B627D] font-psemibold">
                                {recipientFirstName} {recipientLastName}
                            </Text>
                            ?
                       </Text>
                   </View>

                   <View className="pt-2 flex-row items-center">
                       {[1, 2, 3, 4, 5].map((star) => (
                           <TouchableOpacity
                           key={star}
                           onPress={() => setRating(star)} // Set rating on star press
                           >
                               <Image
                                   source={icons.star}
                                   style={{ width: 48, height: 48, tintColor: rating >= star ? '#FDCC0D' : 'gray' }}
                               />
                           </TouchableOpacity>
                       ))}
                   </View>

                   {rating > 0 &&  
                       <View className="pt-2">
                          <TextInput 
                            className="border border-gray-300 p-2 rounded-lg w-[380px] mt-2 font-pmedium"
                            multiline={true}
                            textAlign="left"
                            placeholder="Write your review or suggestions here..."
                            onChangeText={(text) => setFeedback(text)}
                            value={feedback}
                          />

                          <ButtonCustom
                            title={submitting ? 'Submitting...' : 'Submit Feedback'}
                            handlePress={async () => {
                                try {
                                    setSubmitting(true);
                                    await updateDonorFeedback(donation.receiptid, donorEmail, feedback, rating);
                                    Alert.alert("Success", "Feedback submitted successfully.");
                                    setFeedback('');
                                    setRating(0);
                                    navigation.goBack();
                                } catch (error) {
                                    Alert.alert("Error", "Failed to submit feedback. Please try again.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            containerStyles="m-2 mt-5"
                            isLoading={submitting}
                          />
                       </View>
                   }
               </View>
            </>
          </View>
        )}
        </ScrollView>
    </SafeAreaView>
  );
};

export default RatingScreen;
