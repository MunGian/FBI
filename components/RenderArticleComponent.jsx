import React from 'react';
import { Text, View, Image, TouchableOpacity, Linking } from 'react-native';

const renderArticleComponent = ({navigation, ...props }) => (
  <TouchableOpacity
    className="bg-white p-3 mb-3 rounded-lg shadow-md ml-4 mr-4"
    style={{ overflow: 'hidden' }} // Clip overflowing content
    onPress={() => navigation.navigate('ArticleDetail', { articleDetail: props })} // navigate to ArticleDetail screen in explore
  >
    <View className="flex-row justify-between items-center">
      {props.articlephotourl ? (
        <Image
          source={{ uri: props.articlephotourl }}
          className="w-24 h-24 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
          <Text className="text-xs text-gray-500">No Image</Text>
        </View>
      )}

      <View className="flex-1 ml-3">
        <Text
          className="text-lg font-semibold text-[#50C878]"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.articletitle}
        </Text>

        <Text className="text-sm font-text-gray-500">
          <Text className="font-psemibold">Posted On: </Text>
          {props.articledate
            ? new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }).format(new Date(props.articledate))
            : 'N/A'}
        </Text>

        <View>
          <Text className="text-sm text-gray-500"
            numberOfLines={4} // Limit to one line and add ellipsis
            ellipsizeMode="tail" // Truncate at the end if overflowed
          >
            <Text className="font-psemibold">
                Description: {''}
            </Text>
            <Text>
                {props.articledescription}
            </Text>
          </Text>
        </View>

        {/* <Text className="text-sm text-gray-500">
          <Text className="font-psemibold">Posted By: </Text>
          {`${props.postfirstname} ${props.postlastname}` || 'N/A'}
        </Text> */}
      </View>
    </View>
  </TouchableOpacity>
);


export default renderArticleComponent;
