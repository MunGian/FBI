import { Text, View } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'

const TrendingCustom = ({ posts }) => {
  return (
    <FlatList 
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => ( 
            <Text className="text-3xl text-white">
              {item.id}
            </Text>
        )}
        horizontal
    />
  )
}

export default TrendingCustom
