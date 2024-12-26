import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, SafeAreaView, Image as RNImage, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import picker
import DateTimePicker from '@react-native-community/datetimepicker'; 
import * as ImagePicker from 'react-native-image-picker'; // Import image picker
import { supabase } from '../../services/supabase';
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import FormCustom from '../../components/FormCustom';

const EditArticleScreen = ({ route, navigation }) => {
  const { articleDetail } = route.params;
  const [articleTitle, setArticleTitle] = useState(articleDetail.articletitle);
  const [articleDescription, setArticleDescription] = useState(articleDetail.articledescription);
  const [articlePhotoUrl, setArticlePhotoUrl] = useState(articleDetail.articlephotourl);
  const [articleUrl, setArticleUrl] = useState(articleDetail.articleurl);
  const [submitting, setSubmitting] = useState(false);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    // Destructure the first asset if available, otherwise use a default image
    const [firstAsset] = result?.assets || [];
      
    if (firstAsset && firstAsset.uri) {
      // Ensure the URI is a string
      setArticlePhotoUrl(String(firstAsset.uri)) // Convert URI to string if necessary
    }
    else {
      setArticleUrl(articlePhotoUrl);
    }
  };

  const handleUpdate = async () => {
    if (!articleTitle || !articleDescription || !articlePhotoUrl || !articleUrl) {
      Alert.alert("Edit Food Details Error", "Please ensure all fields are filled in before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('article')
        .update({
          articletitle: articleTitle,
          articledescription: articleDescription,
          articlephotourl: articlePhotoUrl,
          articleurl: articleUrl,
        })
        .eq('articleid', articleDetail.articleid);

      if (error) throw error;

      Alert.alert('Success', 'Article details updated successfully!');
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
          <Text className="text-2xl text-white font-pbold mb-2">Edit Article Details</Text>
          <FormCustom
            title="Article Title"
            handleChangeText={setArticleTitle}
            otherStyles="mt-3.5"
            placeholder="Enter the article title"
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
            <Text className="text-[#7b7b8b] font-psemibold text pt-1">{articlePhotoUrl ? 'Change Thumbnail' : 'Select Thumbnail'}</Text>
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

export default EditArticleScreen;
