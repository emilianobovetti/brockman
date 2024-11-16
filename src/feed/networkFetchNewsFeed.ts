import type { FeedResult } from './parser';
import { parseNewsFeed } from './parser';
import { cacheSet } from './cache';

export async function networkFetchNewsFeed(url: string): Promise<FeedResult> {
  const resp = await fetch(url);
  const text = await resp.text();

  return parseNewsFeed(text)
    .forEach((data) => cacheSet(url, data))
    .forEachErr(() => console.error(url));
}
