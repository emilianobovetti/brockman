import type { StyleProp, ViewStyle } from 'react-native'
import { FlatList } from 'react-native'
import type { ListRenderItemInfo } from '@react-native/virtualized-lists'
import type { Bookmark } from '@/bookmarks'
import { useBookmarks } from '@/bookmarks'
import { FeedEntry } from '@/components/FeedEntry'

const getLink = (entry: Bookmark) => entry.link
const feedEntryRenderer = ({ item }: ListRenderItemInfo<Bookmark>) => (
  <FeedEntry item={item} />
)

interface BookmarkListProps {
  style: StyleProp<ViewStyle>
}

export function BookmarkList({ style }: BookmarkListProps) {
  const { bookmarks } = useBookmarks()

  return (
    <FlatList
      data={bookmarks}
      numColumns={1}
      keyExtractor={getLink}
      renderItem={feedEntryRenderer}
      contentContainerStyle={style}
    />
  )
}