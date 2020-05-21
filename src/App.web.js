import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NewsFeedList } from 'components/NewsFeedList';
import { BookmarkList } from 'components/BookmarkList';
import { BookmarksProvider } from 'bookmarks';
import feedList from 'feeds.json';

export default function App() {
  return (
    <BookmarksProvider>
      <View style={styles.container}>
        <NewsFeedList style={styles.section} feeds={feedList} />
        <BookmarkList style={styles.section}/>
      </View>
    </BookmarksProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  section: {
    marginHorizontal: 20,
  },
});
