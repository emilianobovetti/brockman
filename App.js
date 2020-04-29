import React, { useReducer, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import feeds from './feeds.json';
import { NewsFeed } from './components/NewsFeed';
import { fetchNewsFeed } from './NewsFetcher';
import Constants from 'expo-constants';

const initialState = {
  urlToIndex: {},
  feedArray: [],
};

const init = state => {
  feeds.forEach(feed => {
    state.urlToIndex[feed.url] = state.feedArray.push(feed) - 1;
  });

  return state;
};

const reducer = (state, [url, res]) => {
  const index = state.urlToIndex[url];
  const feed = state.feedArray[index];
  feed.fetchResult = res;

  const urlToIndex = state.urlToIndex;
  const feedArray = state.feedArray.slice();

  return { urlToIndex, feedArray };
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  useEffect(() => {
    feeds.forEach(({ url }) =>
      fetchNewsFeed(url).then(res => dispatch([url, res]))
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <FlatList
        data={state.feedArray}
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
