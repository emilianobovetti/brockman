import { Ok } from '@fpc/result'
import type { ParserResult, ParsedFeed } from './parseNewsFeed'
import { networkFetchNewsFeed } from './networkFetchNewsFeed'
import { cacheGet, CACHE_MISS } from './cache'

export async function fetchNewsFeed(url: string): Promise<ParserResult> {
  const cacheRes = await cacheGet<ParsedFeed>(url).catch(() => CACHE_MISS)

  return cacheRes === CACHE_MISS
    ? networkFetchNewsFeed(url)
    : Ok(cacheRes as ParsedFeed)
}
