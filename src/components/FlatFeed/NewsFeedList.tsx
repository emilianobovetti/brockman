import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  FlatList,
  RefreshControl,
  Linking,
  View,
  StyleSheet,
} from 'react-native';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import { fetchNewsFeed, networkFetchNewsFeed } from '@/feed';
import { useBookmarks } from '@/bookmarks';
import type { AtomEntry, FeedResult, ParsedFeed, RSSItem } from '@/feed/parser';
import BookmarkBorderIcon from '@/assets/bookmark_border-24px.svg';
import BookmarkIcon from '@/assets/bookmark-24px.svg';

interface FeedInfo {
  name: string;
  url: string;
}

type NewsFeedFetcher = (url: string) => Promise<FeedResult>;
type UrlToFetched = { [url: string]: FeedResult };

interface NewsFeedListProps {
  feeds: FeedInfo[];
  style: StyleProp<ViewStyle>;
}

function getElements(feed: ParsedFeed): RSSItem[] | AtomEntry[] {
  return [];
}

function getDate(elem: RSSItem | AtomEntry): Date | null {
  switch (elem.type) {
    case 'rss':
      return elem.pubDate;
    case 'atom':
      return elem.updated;
    default:
      return null;
  }
}

function compareFeedElements(
  fst: RSSItem | AtomEntry,
  snd: RSSItem | AtomEntry,
) {
  return (getDate(snd) ?? 0).valueOf() - (getDate(fst) ?? 0).valueOf();
}

function getKey({ key }: RSSItem | AtomEntry) {
  return key;
}

function getHost(url: string) {
  const [, , host] = url.match(/^([^/]*\/\/)?([^/]*)\//) ?? [];

  return host;
}

function getHTML(elem: RSSItem | AtomEntry) {
  switch (elem.type) {
    case 'rss':
      return elem.description;
    case 'atom':
      return elem.content;
    default:
      return null;
  }
}

interface RSSElementProps {
  element: RSSItem | AtomEntry;
}

function RSSElement({ element }: RSSElementProps) {
  const { colors } = useTheme();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const title = element.title ?? 'Unknown article title';
  const { link } = element;
  const host = link == null ? 'Unknown site host' : getHost(link);
  const html = getHTML(element) ?? 'Empty article content';
  const date = getDate(element)?.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Title
        title={title}
        subtitle={host}
        right={(props) =>
          date == null ? null : (
            <Text {...props} style={{ marginRight: 10 }}>
              {date}
            </Text>
          )
        }
      />
      <Card.Content>
        <View style={styles.container}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            onShouldStartLoadWithRequest={(event) => {
              if (event.navigationType === 'click') {
                Linking.openURL(event.url);
              }

              return false;
            }}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            javaScriptEnabled={false}
            style={styles.webview}
          />
          <LinearGradient
            colors={['#FFFFFF00', colors.elevation.level1]}
            locations={[0.8, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        </View>
      </Card.Content>
      <Card.Actions>
        {link == null ? null : (
          <Button mode="text" onPress={() => Linking.openURL(link)}>
            Continua a leggere
          </Button>
        )}
        <Button mode="text">
          {isBookmarked(element) ? (
            <BookmarkIcon fill="#000" />
          ) : (
            <BookmarkBorderIcon fill="#000" />
          )}
        </Button>
      </Card.Actions>
    </Card>
  );
}

function elementRenderer({ item }: ListRenderItemInfo<RSSItem | AtomEntry>) {
  return <RSSElement element={item} />;
}

export function NewsFeedList({ feeds = [], style }: NewsFeedListProps) {
  const [urlToFeed, setUrlToFeed] = useState<UrlToFetched>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(
    (fetcher: NewsFeedFetcher) => {
      const fetches = feeds.map(({ url }) => {
        function onSuccess(result: FeedResult) {
          setUrlToFeed((curr) => ({ ...curr, [url]: result }));
        }

        return fetcher(url).then(onSuccess, console.error);
      });

      Promise.all(fetches).then(() => setLoading(false));
    },
    [feeds],
  );

  const refresh = useCallback(() => {
    setLoading(true);
    fetchAll(networkFetchNewsFeed);
  }, [fetchAll]);

  useEffect(() => fetchAll(fetchNewsFeed), [fetchAll]);

  const feedArray = useMemo(() => {
    let array: Array<RSSItem | AtomEntry> = [];

    for (const url in urlToFeed) {
      const result = urlToFeed[url];

      if (result.isOk) {
        array = array.concat(getElements(result.get()));
      }
    }

    return array.sort(compareFeedElements).slice(0, 50);
  }, [urlToFeed]);

  return (
    <FlatList
      style={{ marginTop: 10 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
      data={feedArray}
      numColumns={1}
      keyExtractor={getKey}
      renderItem={elementRenderer}
      contentContainerStyle={style}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    backgroundColor: 'transparent',
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
});
