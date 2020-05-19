import React from 'react';
import { FlatList } from 'react-native';
import { useBookmarks } from 'bookmarks';
import { FeedEntry } from 'components/FeedEntry';

const getLink = entry => entry.link;
const feedEntryRenderer = ({ item }) => <FeedEntry {...item} />;

export function BookmarkList() {
  const { bookmarks } = useBookmarks();

  return (
    <FlatList
      data={bookmarks}
      numColumns={1}
      keyExtractor={getLink}
      renderItem={feedEntryRenderer}
    />
  );
}
