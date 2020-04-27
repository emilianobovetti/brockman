import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFetch, usePromise } from '@fpc/hooks';
import { parseNewsFeed } from 'NewsParser';
import { Ionicons } from '@expo/vector-icons';
import { RSSFeed } from 'components/RSSFeed';
import { AtomFeed } from 'components/AtomFeed';

export function NewsFeed({ url }) {
  const [resp, refetch] = useFetch(url);
  const [parseResult, fetchErr, state] = usePromise(() =>
    resp.then(r => r.text()).then(parseNewsFeed), [resp]
  );

  if (state === 'pending') {
    return (
      <View style={styles.row}>
        <Text style={styles.title}>Loading...</Text>
        <Ionicons name="md-wifi" size={30} color={'#555'} />
      </View>
    );
  }

  if (fetchErr != null) {
    console.error(fetchErr);
    return (
      <View style={styles.row}>
        <Text style={styles.title}>Oh no! Network error!</Text>
        <Ionicons name="md-bug" size={30} color={'#555'} />
      </View>
    );
  }

  const [feedData, parseErr] = parseResult;

  if (parseErr != null) {
    console.error(parseErr);
    return (
      <View style={styles.row}>
        <Text style={styles.title}>Oh no! Parse error!</Text>
        <Ionicons name="md-bug" size={30} color={'#555'} />
      </View>
    );
  }

  switch (feedData.type) {
    case 'rss':
      return <RSSFeed {...feedData} />;
    case 'atom':
      return <AtomFeed {...feedData} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight:'bold',
    color: '#333',
  },
  row:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems:'center',
    backgroundColor: '#ddd',
  },
});
