import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import type { Bookmark } from '@/bookmarks';
import { useBookmarks } from '@/bookmarks';
import { RSSPost } from '@/components/RSSPost';
import BookmarkBorderIcon from '@/assets/bookmark-border-24px.svg';

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
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            variant="headlineMedium"
            style={{ position: 'relative', right: 2 }}
          >
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

function getKey({ post }: Bookmark) {
  return `bookmark-item-${post.key}`;
}

function elementRenderer({ item }: ListRenderItemInfo<Bookmark>) {
  return <RSSPost meta={item.meta} post={item.post} />;
}
