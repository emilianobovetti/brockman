import type { FeedResult } from './parser';
import { parseNewsFeed } from './parser';
import { cacheSet } from './cache';

export async function networkFetchNewsFeed(url: string): Promise<FeedResult> {
  const resp = await fetch(url);
  const text = await resp.text();
  const parseRes: FeedResult = parseNewsFeed(text);

  parseRes.forEach((data) => cacheSet(url, data));

  return parseRes;
}
