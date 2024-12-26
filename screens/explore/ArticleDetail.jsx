import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Image as RNImage, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase'; 
import icons from '../../constants/icons';
import ButtonCustom from '../../components/ButtonCustom';
import { SafeAreaView } from 'react-native-safe-area-context';

const ArticleDetailScreen = ({ route }) => {
  const { articleDetail } = route.params;
  const navigation = useNavigation();

  const [articleTitle, setArticleTitle] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [articlePhotoUrl, setArticlePhotoUrl] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [articleDate, setArticleDate] = useState('');
  const [postFirstName, setPostFirstName] = useState('');
  const [postLastName, setPostLastName] = useState('');
  const [postPhoto, setPostPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    setArticleTitle(articleDetail.articletitle);
    setArticleDescription(articleDetail.articledescription);
    setArticlePhotoUrl(articleDetail.articlephotourl);
    setArticleUrl(articleDetail.articleurl);
    setArticleDate(articleDetail.articledate);
    setPostFirstName(articleDetail.postfirstname);
    setPostLastName(articleDetail.postlastname);
    setPostPhoto(articleDetail.postphoto);
  }, ([]));
  

  const handlePress = () => {
    if (articleUrl) {
      Linking.openURL(articleUrl).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    } else {
      console.error("No article URL provided.");
    }
  };

 const deleteArticle = async (articleId) => {
    try {
      const { error } = await supabase
        .from('article')
        .delete()
        .eq('articleid', articleId);

      if (error) throw error;

      Alert.alert('Success', 'Article deleted successfully.');
    } catch (error) {
      console.error('Error deleting article:', error.message);
      Alert.alert('Error', 'Failed to delete article. Please try again.');
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

            {/* Article Details Box */}
            <View className="bg-white p-5 pb-1 rounded-lg shadow-lg mb-2 z-0">
                <Text className="text-2xl font-bold text-[#50C878] mb-3 mt-12">
                    {articleTitle}
                </Text>

                <Image
                    source={
                        articlePhotoUrl
                        ? { uri: articlePhotoUrl }
                        : icons.defaultUserIcon
                    }
                    className="w-full h-64 rounded-lg mb-4"
                    resizeMode="cover"
                />

                <Text className="text-base font-pmedium text-gray-700 mb-2">
                    <Text className="font-psemibold">Posted On: </Text>
                    {articleDate
                        ? new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        }).format(new Date(articleDate))
                        : 'N/A'}
                </Text>

                <Text className="text-base font-psemibold text-gray-700">Article Description: </Text>
                <Text className="text-md font-pmedium text-gray-700 mb-2">
                    {articleDescription}
                </Text>

                <View className="">
                    <Text className="text-base font-psemibold text-gray-700">
                        Posted By:
                    </Text>
                    <Text className="text-md font-pmedium text-gray-700 mb-1.5">
                        {postFirstName && postLastName
                        ? `${postFirstName} ${postLastName}`
                        : 'N/A'}
                    </Text>
                </View>
            </View>
            
             {/* Conditional Rendering: Donor Info or Edit Food Button (for donor only in create tab) */}
          {articleDetail.type === 'post' ? (
            <>
              <ButtonCustom
                title={submitting ? 'Redirecting...' : 'Read Article'}
                handlePress={() => {
                  setSubmitting(true);
                  handlePress();
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
              title={submitting ? 'Redirecting...' : 'Edit Article Details'}
              handlePress={() => {
                setSubmitting(true);
                navigation.navigate('EditArticleDetail', { articleDetail });
                setSubmitting(false);
              }}
              containerStyles="m-2"
              isLoading={submitting}
            />
        
            {/* Delete Food Button */}
            <ButtonCustom
              title={submitting ? 'Deleting...' : 'Delete Article'}
              handlePress={() => {
                Alert.alert(
                  'Delete Confirmation',
                  'Are you sure you want to delete this article? This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        setSubmitting(true);
                        await deleteArticle(articleDetail.articleid); 
                        navigation.goBack(); // Navigate back to the previous screen
                      },
                    },
                  ]
                );
              }}
              containerStyles="m-2 mt-1 bg-[#8B0000]"
              isLoading={submitting}
            />
          </View>
        )}
        </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleDetailScreen;
