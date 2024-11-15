import { Ok } from '@fpc/result';
import type { FeedResult, ParsedFeed } from './parser';
import { networkFetchNewsFeed } from './networkFetchNewsFeed';
import { cacheGet, CACHE_MISS } from './cache';

function restoreDates(feed: ParsedFeed): ParsedFeed {
  switch (feed.type) {
    case 'rss':
      for (const item of feed.items) {
        item.pubDate = item.pubDate == null ? null : new Date(item.pubDate);
      }

      break;
    case 'atom':
      for (const entry of feed.entries) {
        entry.updated = entry.updated == null ? null : new Date(entry.updated);
      }

      break;
  }

  return feed;
}

export async function fetchNewsFeed(url: string): Promise<FeedResult> {
  const cacheRes = await cacheGet<ParsedFeed>(url).catch(() => CACHE_MISS);

  return cacheRes === CACHE_MISS
    ? networkFetchNewsFeed(url)
    : Ok(cacheRes as ParsedFeed).map(restoreDates);
}
