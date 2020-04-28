import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import feeds from './feeds.json';
import { NewsFeed } from './components/NewsFeed';
import Constants from 'expo-constants';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <FlatList
        data={feeds}
        numColumns={1}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={item => item.url}
        renderItem={({ item }) => <NewsFeed {...item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "#6d0705",
    height: Constants.statusBarHeight,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  contentContainer: {
    marginHorizontal: 25,
  },
});
