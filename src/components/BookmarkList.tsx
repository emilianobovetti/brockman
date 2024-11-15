import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import { useBookmarks } from '@/bookmarks';
import { AtomEntry, RSSItem } from '@/feed/parser';
import { RSSElement } from '@/components/RSSElement';
import BookmarkBorderIcon from '@/assets/bookmark_border-24px.svg';

interface BookmarkListProps {
  style: StyleProp<ViewStyle>;
}

export function BookmarkList({ style }: BookmarkListProps) {
  const { bookmarks } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
        }}>
        <Text variant="headlineLarge">
          Nessun segnalibro salvato{' '}
          <BookmarkBorderIcon fill="#000" height={20} width={20} />
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ marginTop: 10 }}
      data={bookmarks}
      numColumns={1}
      keyExtractor={getKey}
      renderItem={elementRenderer}
      contentContainerStyle={style}
    />
  );
}

function getKey({ link }: RSSItem | AtomEntry) {
  return `bookmark-item-${link}`;
}

function elementRenderer({ item }: ListRenderItemInfo<RSSItem | AtomEntry>) {
  return <RSSElement elem={item} />;
}
