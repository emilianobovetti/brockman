import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import { useBookmarks } from '@/bookmarks';
import { AtomEntry, RSSItem } from '@/feed/parser';
import { RSSElement } from '@/components/RSSElement';
import BookmarkBorderIcon from '@/assets/bookmark_border-24px.svg';

interface BookmarkListProps {
  style: StyleProp<ViewStyle>;
}

export function BookmarkList({ style }: BookmarkListProps) {
  const { colors } = useTheme();
  const { bookmarks } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            variant="headlineMedium"
            style={{ position: 'relative', right: 2 }}>
            Nessun segnalibro salvato
          </Text>
          <BookmarkBorderIcon
            fill="#000"
            style={{ position: 'relative', top: 2, left: 2 }}
            height={22}
            width={22}
          />
        </View>
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
