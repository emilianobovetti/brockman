import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, RefreshControl, Linking } from 'react-native';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import { Button, Card, Text } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import type { ParserResult, ParsedFeed } from '@/utils/feed/parseNewsFeed';
import { fetchNewsFeed, networkFetchNewsFeed } from '@/utils/feed';
import BookmarkBorderIcon from '@/assets/bookmark_border-24px.svg';
import BookmarkIcon from '@/assets/bookmark-24px.svg';

interface FeedInfo {
  name: string;
  url: string;
}

export type RSSItem = {
  type: 'rss';
  id: string;
  title: string | null;
  link: string | null;
  pubDate: Date | null;
  description: string | null;
};

export type AtomEntry = {
  type: 'atom';
  id: string;
  title: string | null;
  link: string | null;
  updated: Date | null;
  content: string | null;
};

type NewsFeedFetcher = (url: string) => Promise<ParserResult>;
type UrlToFetched = { [url: string]: ParserResult };

interface NewsFeedListProps {
  feeds: FeedInfo[];
  style: StyleProp<ViewStyle>;
}

function randomChunk() {
  return String((Math.random() * 2147483647) | 0).padStart(10, '0');
}

function randomId() {
  return Array(4).fill(null).map(randomChunk).join('');
}

function parsedFeedElements(feed: ParsedFeed): Array<RSSItem | AtomEntry> {
  if (feed.type === 'rss') {
    return feed.items.map((item) => {
      const pubDate = item.pubDate == null ? null : new Date(item.pubDate);

      return {
        type: 'rss',
        id: randomId(),
        title: item.title,
        link: item.link,
        pubDate,
        description: item.description,
      };
    });
  }

  if (feed.type === 'atom') {
    return feed.entries.map((entry) => {
      const updated = entry.updated == null ? null : new Date(entry.updated);

      return {
        type: 'atom',
        id: randomId(),
        title: entry.title,
        link: entry.link,
        updated,
        content: entry.content,
      };
    });
  }

  // @ts-ignore: Property 'msg' does not exist on type 'never'
  throw new Error(`Unknown feed type: ${feed.type}`);
}

function getDate(elem: RSSItem | AtomEntry): Date | null {
  if (elem.type === 'rss') {
    return elem.pubDate;
  }

  if (elem.type === 'atom') {
    return elem.updated;
  }

  return null;
}

function compareFeedElements(
  fst: RSSItem | AtomEntry,
  snd: RSSItem | AtomEntry,
) {
  return (getDate(snd) ?? 0).valueOf() - (getDate(fst) ?? 0).valueOf();
}

function getId({ id }: RSSItem | AtomEntry) {
  return id;
}

function getHost(url: string) {
  const [, , host] = url.match(/^([^/]*\/\/)?([^/]*)\//) ?? [];

  return host;
}

function getHTML(elem: RSSItem | AtomEntry) {
  if (elem.type === 'rss') {
    return elem.description;
  }

  if (elem.type === 'atom') {
    return elem.content;
  }

  return null;
}

function elementRenderer({ item }: ListRenderItemInfo<RSSItem | AtomEntry>) {
  const { title, link } = item;

  const host = link == null ? 'Unknown site host' : getHost(link);
  const html = getHTML(item) ?? 'Empty article content';
  const date = getDate(item)?.toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card style={{ marginBottom: 10 }}>
      <Card.Title
        title={title ?? 'Unknown article title'}
        subtitle={host}
        right={(props) => (
          <Text {...props} style={{ marginRight: 10 }}>
            {date ?? ''}
          </Text>
        )}
      />
      <Card.Content>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={{ backgroundColor: 'transparent', height: 200, width: '100%' }}
        />
      </Card.Content>
      <Card.Actions>
        {link == null ? null : (
          <Button mode="text" onPress={() => Linking.openURL(link)}>
            Continua a leggere
          </Button>
        )}
        <Button mode="text">
          <BookmarkBorderIcon fill="#000" />
        </Button>
      </Card.Actions>
    </Card>
  );
}

export function NewsFeedList({ feeds = [], style }: NewsFeedListProps) {
  const [urlToFeed, setUrlToFeed] = useState<UrlToFetched>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(
    (fetcher: NewsFeedFetcher) => {
      const fetches = feeds.map(({ url }) => {
        function onSuccess(result: ParserResult) {
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
        array = array.concat(parsedFeedElements(result.get()));
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
      keyExtractor={getId}
      renderItem={elementRenderer}
      contentContainerStyle={style}
    />
  );
}
