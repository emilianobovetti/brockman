import { Ok } from '@fpc/result';
import { networkFetchNewsFeed } from './networkFetchNewsFeed';
import { cacheGet, CACHE_MISS } from './cache';

export const fetchNewsFeed = async url => {
  const cacheRes = await cacheGet(url).catch(() => CACHE_MISS);

  return cacheRes === CACHE_MISS ? networkFetchNewsFeed(url) : Ok(cacheRes);
};
