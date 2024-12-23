import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';

const CompleteDetails = ({ route, navigation }) => {
  const { foodItem, requestItem, donorEmail, requestEmail, type } = route.params || {}; // fallback to an empty object if route.params is undefined
  
  const [typingPhone, setTypingPhone] = useState('+60');
  const [submitting, setSubmitting] = useState(false);

  const [recipientExists, setRecipientExists] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientPhoto, setRecipientPhoto] = useState('');

  const handleCompleteDonation = async (foodid) => {
    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('donation')
        .update({
          status: 'Completed',
        })
        .eq('foodid', foodid);

      if (error) throw error;

      const { data: receiptData, error: receiptError } = await supabase
        .from('receipt')
        .insert(
          { 
            donoremail: donorEmail,
            recipientemail: recipientEmail,
            foodid: foodid,
            receiptdate: new Date().toISOString(),
          }
        );

      if (receiptError) throw receiptError;

      Alert.alert('Success', 'Donation completed successfully! Thanks for your contribution!');
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Error', `Failed to complete donation details: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteRequest = async (requestid) => {
    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('request')
        .update({
          status: 'Completed',
        })
        .eq('requestid', requestid);

      if (error) throw error;

      const { data: receiptData, error: receiptError } = await supabase
        .from('receipt')
        .insert(
          { 
            donoremail: recipientEmail, // because recipient is now the donor 
            recipientemail: requestEmail,
            requestid: requestid,
            receiptdate: new Date().toISOString(),
          }
        );

      if (receiptError) throw receiptError;

      Alert.alert('Success', 'Request completed successfully! Thanks for your contribution!');
      navigation.pop(2);
    } catch (error) {
      Alert.alert('Error', `Failed to complete request details: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const checkRecipient = async () => {
    try {
      const email = type === 'donor' ? donorEmail : requestEmail;
  
      // Fetch recipient details and validate against the current user
      const { data: recipientData, error } = await supabase
        .from('users')
        .select('*')
        .eq('phonenumber', typingPhone)
        .single(); // Get a single user record
  
      if (error) {
        if (error.code === 'PGRST116') {
          // Handle case where no user is found
          Alert.alert('Recipient Not Found', 'The entered phone number does not exist.');
          setRecipientExists(false);
        } else {
          throw error; // Handle other errors
        }
        return;
      }
  
      // Check if the recipient is the current user
      if (recipientData.email === email) {
        Alert.alert('Recipient Not Found', 'You cannot donate to yourself.');
        return;
      }
  
      // Set recipient details
      setRecipientEmail(recipientData.email);
      setRecipientFirstName(recipientData.firstname);
      setRecipientLastName(recipientData.lastname);
      setRecipientPhone(recipientData.phonenumber);
      setRecipientPhoto(recipientData.photo_url);
      setRecipientExists(true);
  
    } catch (error) {
      Alert.alert('Error', `Failed to check recipient: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Complete {type === 'donor' ? 'Donation': 'Request'} Details</Text>
          
          <View className="flex-row items-center">
            <FormCustom
              title={`${type === 'donor' ? 'Recipient' : 'Donor'} Phone Number`}
              handleChangeText={setTypingPhone}
              otherStyles="mt-3.5 w-5/6"
              placeholder={`${type === 'donor' ? 'Recipient' : 'Donor'}'s phone number (e.g., +60123456789)`}
              value={typingPhone}
            />

            <TouchableOpacity 
              className="mt-11 ml-1 items-center justify-center h-16 px-3 bg-white border-2 border-black-100 
                        rounded-2xl focus:border-[#1B627D]" 
              onPress={() => {
                setTypingPhone('+60')
                setRecipientExists(false);
              }}
            >
              <Text className="text-black-200 font-psemibold">
                Reset
              </Text>
            </TouchableOpacity>
          </View>
  
          { !recipientExists &&
            <>
              {/* Submit Button */}
              <ButtonCustom
                title={submitting ? 'Submitting...' : 'Confirm Recipient'}
                handlePress={checkRecipient}
                containerStyles="mt-4"
                isLoading={submitting}
              />
            </>
          }
  
          {recipientExists && (
            <View>
              {/* request Information Box */}
              <View className="mt-4 bg-white p-6 pt-2 pb-2 rounded-lg shadow-lg items-center flex-row">
                <View>
                  <Image
                    source={{ uri: recipientPhoto }}
                    className="w-24 h-24 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
                <View className="ml-4 pt-2">
                  <Text className="text-base font-psemibold text-gray-700">
                  {`${type === 'donor' ? 'Recipient' : 'Donor'} Name :`}
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700 mb-1.5">
                    {recipientFirstName && recipientLastName
                      ? `${recipientFirstName} ${recipientLastName}`
                      : 'N/A'}
                  </Text>
                  <Text className="text-base font-psemibold text-gray-700">
                    {`${type === 'donor' ? 'Recipient' : 'Donor'} Phone Number :`}
                  </Text>
                  <Text className="text-md font-pmedium text-gray-700">
                    {recipientPhone || 'N/A'}
                  </Text>
                </View>
              </View>
              
              {
                type === 'donor'? (
                  <ButtonCustom
                    title={submitting ? 'Submitting...' : 'Complete Donation'}
                    handlePress={() => {
                      Alert.alert(
                        'Complete Donation Confirmation',
                        'Are you sure the recipient details are correct? This action cannot be undone.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Confirm',
                            style: 'destructive',
                            onPress: async () => {
                              setSubmitting(true);
                              await handleCompleteDonation(foodItem.foodid); 
                              setSubmitting(false);
                              // navigation.navigate('RatingScreen', { foodItem });
                            },
                          },
                        ]
                      );
                    }}
                    containerStyles="mt-4"
                    isLoading={submitting}
                  />
                ) : (
                  <ButtonCustom
                    title={submitting ? 'Submitting...' : 'Complete Request'}
                    handlePress={() => {
                      Alert.alert(
                        'Complete Request Confirmation',
                        'Are you sure the donor details are correct? This action cannot be undone.',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Confirm',
                            style: 'destructive',
                            onPress: async () => {
                              setSubmitting(true);
                              await handleCompleteRequest(requestItem.requestid); 
                              setSubmitting(false);
                            },
                          },
                        ]
                      );
                    }}
                    containerStyles="mt-4"
                    isLoading={submitting}
                  />
                )
              }
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompleteDetails;
