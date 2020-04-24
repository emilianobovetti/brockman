import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import feeds from './feeds.json';
import { RSSChannel } from 'components/RSSChannel';

export default function App() {
  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        keyExtractor={item => item}
        renderItem={({ item }) => <RSSChannel url={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
