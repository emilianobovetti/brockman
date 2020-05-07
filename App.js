import React, { useState } from 'react';
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { NewsFeedList } from 'components/NewsFeedList';
import feeds from 'feeds';

// TODO: this method is android-only
StatusBar.setBackgroundColor('#6d0705');

export default function App() {
  const feedName = useState('frontend');

  return (
    <View style={styles.container}>
      <NewsFeedList feeds={feeds.frontend} />

      <View style={styles.footer}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
  }
});
