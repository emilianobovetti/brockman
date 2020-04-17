import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import feeds from './feeds.json';
import { parseRSS } from './RSSParser';

const fetchRss = feeds.map(feed =>
  fetch(feed)
    .then(resp => resp.text())
    .then(parseRSS)
);

Promise.all(fetchRss).then(arr => arr.forEach(rss => console.log(rss.merge())));
//Promise.all(fetchRss).then(arr => arr.forEach(rss => rss.merge()));

export default function App() {
  return (
    <View style={styles.container}>
      <Text>hello, world</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
