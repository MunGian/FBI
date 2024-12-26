import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';
import * as ImagePicker from 'react-native-image-picker';

const CreateArticle = ({ navigation }) => {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [articlePhotoUrl, setArticlePhotoUrl] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      setArticlePhotoUrl(result.assets[0].uri);
    }
  };

  // Handle Form Submission
const handleSubmit = async () => {

    // Check for empty fields
    if (
        !articleTitle.trim() ||
        !articleDescription.trim() ||
        !articlePhotoUrl ||
        !articleUrl 
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
      console.log(user);

      // Insert into the donation table
      const { error: donationError } = await supabase
        .from('article')
        .insert([
          {
            articletitle: articleTitle,
            articleurl: articleUrl,
            articledescription: articleDescription,
            articlephotourl: articlePhotoUrl,
            email: user.email,
          },
        ]);
  
      if (donationError) throw donationError;
  
      Alert.alert('Success', 'Article posted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to post article: ${error.message}`);
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
          <Text className="text-2xl text-white font-pbold mb-2">Post New Article</Text>
          
          <FormCustom
            title="Article Title"
            handleChangeText={setArticleTitle}
            otherStyles="mt-3.5"
            placeholder="Enter your article title"
            value={articleTitle}
          />
        
         <FormCustom
            title="Article Link (URL)"
            handleChangeText={setArticleUrl}
            otherStyles="mt-3.5"
            placeholder="Enter the article link (URL)"
            value={articleUrl}
          />
        
          <Text className="text-base text-white font-pmedium mt-4">Article Thumbnail:</Text>
          <TouchableOpacity
            onPress={selectImage}
            className="mt-2 p-3 bg-white rounded-lg flex-row items-center"
          >
             <Text className="text-[#7b7b8b] font-psemibold text pt-1 pl-1.5">{articlePhotoUrl ? 'Change Thumbnail' : 'Select Thumbnail'}</Text>
          </TouchableOpacity>
          {articlePhotoUrl && (
            <RNImage
              source={{ uri: articlePhotoUrl }}
              style={{ width: 100, height: 100, marginTop: 10, borderRadius: 10 }}
            />
          )}

          <FormCustom
            title="Article Description"
            handleChangeText={setArticleDescription}
            otherStyles="mt-3.5"
            placeholder="Enter the article description"
            value={articleDescription}
          />

          <ButtonCustom
            title={submitting ? 'Submitting...' : 'Post New Article'}
            handlePress={handleSubmit}
            containerStyles="mt-4"
            isLoading={submitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateArticle;
