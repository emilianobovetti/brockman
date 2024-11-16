import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import type { ListRenderItemInfo } from '@react-native/virtualized-lists';
import { fetchNewsFeed, networkFetchNewsFeed } from '@/feed';
import { cacheClear } from '@/feed/cache';
import type { AtomEntry, FeedResult, ParsedFeed, RSSItem } from '@/feed/parser';
import { RSSElement, getDate } from '@/components/RSSElement';

interface FeedInfo {
  name: string;
  url: string;
}

type NewsFeedFetcher = (url: string) => Promise<FeedResult>;
type UrlToFetched = { [url: string]: FeedResult };

interface FlatFeedListProps {
  feeds: FeedInfo[];
  style: StyleProp<ViewStyle>;
}

export function FlatFeedList({ feeds = [], style }: FlatFeedListProps) {
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
    setUrlToFeed({});
    cacheClear();
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

function getElements(feed: ParsedFeed): RSSItem[] | AtomEntry[] {
  switch (feed.type) {
    case 'rss':
      return feed.items;
    case 'atom':
      return feed.entries;
    default:
      return [];
  }
}

function getKey({ key }: RSSItem | AtomEntry) {
  return `feed-item-${key}`;
}

function elementRenderer({ item }: ListRenderItemInfo<RSSItem | AtomEntry>) {
  return <RSSElement elem={item} />;
}

function compareFeedElements(
  fst: RSSItem | AtomEntry,
  snd: RSSItem | AtomEntry,
) {
  return (getDate(snd) ?? 0).valueOf() - (getDate(fst) ?? 0).valueOf();
}
