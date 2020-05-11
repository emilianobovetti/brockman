import Cache from './Cache';
import { btoa } from './Base64';
import { Ok } from '@fpc/result';
import { parseNewsFeed } from 'NewsParser';

const CACHE_MISS = {};
const CACHE_STALE = {};
const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

const cacheKeys = url => {
  const b64 = btoa(url.trim());

  return [`${b64}:fetchedAt`, `${b64}:text`];
};

const cacheGet = async url => {
  const [fst = [], snd = []] = await Cache.multiGet(cacheKeys(url));
  const [, timestamp] = fst;
  const [, text] = snd;
  const fetchedAt = parseInt(timestamp, 10);

  if (isNaN(fetchedAt)) {
    return CACHE_MISS;
  }

  if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_STALE;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return CACHE_MISS;
  }
};

const cacheSet = (url, text) => {
  const [fetchedAtKey, textKey] = cacheKeys(url);

  return Cache.multiSet([
    [fetchedAtKey, String(Date.now())],
    [textKey, text],
  ]);
};

export const networkFetchNewsFeed = async url => {
  const resp = await fetch(url);
  const text = await resp.text();
  const parseRes = parseNewsFeed(text);

  parseRes.forEach(data => cacheSet(url, JSON.stringify(data)));

  return parseRes;
};

export const fetchNewsFeed = async url => {
  const cacheRes = await cacheGet(url).catch(() => CACHE_MISS);

  if (cacheRes === CACHE_MISS || cacheRes === CACHE_STALE) {
    return networkFetchNewsFeed(url);
  }

  return Ok(cacheRes);
};
