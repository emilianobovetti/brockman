import { Ok } from '@fpc/result';
import type { FeedResult, ParsedFeed } from './parser';
import { reHydrateFeed } from './parser';
import { networkFetchNewsFeed } from './networkFetchNewsFeed';
import { cacheGet, CACHE_MISS } from './cache';

export async function fetchNewsFeed(url: string): Promise<FeedResult> {
  const cacheRes = await cacheGet<ParsedFeed>(url).catch(() => CACHE_MISS);

  return cacheRes === CACHE_MISS
    ? networkFetchNewsFeed(url)
    : Ok(reHydrateFeed(cacheRes as ParsedFeed));
}
