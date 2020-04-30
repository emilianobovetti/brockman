import React, { useReducer, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import feeds from './feeds.json';
import { NewsFeed } from './components/NewsFeed';
import { fetchNewsFeed, networkFetchNewsFeed } from './NewsFetcher';
import Constants from 'expo-constants';

const initAppState = {
  totalItems: feeds.length,
  fetchCount: 0,
  refreshCount: 0,
  feedFetcher: fetchNewsFeed,
  refreshing: false,
  urlToIndex: {},
  feedArray: [],
};

feeds.forEach(feed => {
  initAppState.urlToIndex[feed.url] = initAppState.feedArray.push(feed) - 1;
});

const handleFetchResult = (state, [url, res]) => {
  const fetchCount = state.fetchCount + 1;
  const index = state.urlToIndex[url];
  const feed = state.feedArray[index];
  feed.fetchResult = res;

  return {
    ...state,
    fetchCount,
    refreshing: state.refreshing && fetchCount < state.totalItems,
    feedArray: state.feedArray.slice(),
  };
};

const resetFetchResult = feed => {
  const { fetchResult, ...rest } = feed;

  return rest;
};

const handleRefresh = state => ({
  ...initAppState,
  feedArray: state.feedArray.map(resetFetchResult),
  refreshCount: state.refreshCount + 1,
  feedFetcher: networkFetchNewsFeed,
  refreshing: true,
});

const appStateReducer = (state, msg) => {
  switch (msg) {
    case 'refresh':
      return handleRefresh(state);
    default:
      return handleFetchResult(state, msg);
  }
};

const getUrl = ({ url }) => url;
const newsFeedRenderer = ({ item }) => <NewsFeed {...item} />;

export default function App() {
  const [state, dispatch] = useReducer(appStateReducer, initAppState);

  useEffect(() => {
    feeds.forEach(({ url }) =>
      state.feedFetcher(url).then(res => dispatch([url, res]))
    );
  }, [state.feedFetcher, state.refreshCount]);

  return (
    <View style={styles.container}>
      <View style={styles.statusBar} />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={() => dispatch('refresh')}
          />
        }
        data={state.feedArray}
        numColumns={1}
        contentContainerStyle={styles.contentContainer}
        keyExtractor={getUrl}
        renderItem={newsFeedRenderer}
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
