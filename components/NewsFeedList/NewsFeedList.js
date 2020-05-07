import React, { useReducer, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { fetchNewsFeed, networkFetchNewsFeed } from 'NewsFetcher';
import { NewsFeed } from 'components/NewsFeed';

const initFromFeeds = feeds => {
  const urlToIndex = {};
  const feedArray = [];

  feeds.forEach(feed => {
    urlToIndex[feed.url] = feedArray.push(feed) - 1;
  });

  return {
    totalItems: feeds.length,
    fetchCount: 0,
    feedFetcher: fetchNewsFeed,
    refreshing: false,
    urlToIndex,
    feedArray,
  };
};

const resetFetchResult = feed => {
  const { fetchResult, ...rest } = feed;

  return rest;
};

const handleRefresh = state => ({
  ...initFromFeeds(state.feedArray.map(resetFetchResult)),
  feedFetcher: networkFetchNewsFeed,
  refreshing: true,
});

const handleReset = (state, { feeds }) => ({
  ...initFromFeeds(feeds),
  feedFetcher: fetchNewsFeed,
});

const handleResponse = (state, { url, result }) => {
  const fetchCount = state.fetchCount + 1;
  const index = state.urlToIndex[url];
  const feed = state.feedArray[index];
  feed.fetchResult = result;

  return {
    ...state,
    fetchCount,
    refreshing: state.refreshing && fetchCount < state.totalItems,
    feedArray: state.feedArray.slice(),
  };
};

const reducer = (state, action) => {
  switch (action.msg) {
    case 'refresh':
      return handleRefresh(state);
    case 'reset':
      return handleReset(state, action);
    case 'response':
      return handleResponse(state, action);
    default:
      throw new Error(`Unknown message '${action.msg}'`);
  }
};

const getUrl = ({ url }) => url;
const newsFeedRenderer = ({ item }) => <NewsFeed {...item} />;

export function NewsFeedList({ feeds = [] }) {
  const [state, dispatch] = useReducer(reducer, feeds, initFromFeeds);
  const { urlToIndex, feedFetcher } = state;

  useEffect(() => {
    dispatch({ msg: 'reset', feeds });
  }, [feeds]);

  useEffect(() => {
    Object.keys(urlToIndex).forEach(url =>
      feedFetcher(url).then(result => dispatch({ msg: 'response', url, result }))
    );
  }, [urlToIndex, feedFetcher]);

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={state.refreshing}
          onRefresh={() => dispatch({ msg: 'refresh' })}
        />
      }
      data={state.feedArray}
      numColumns={1}
      contentContainerStyle={styles.container}
      keyExtractor={getUrl}
      renderItem={newsFeedRenderer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
  },
});
