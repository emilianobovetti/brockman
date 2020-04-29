import Cache from './Cache';
import { btoa } from './Base64';
import { isString } from '@fpc/types';
import { Ok, Err } from '@fpc/result';
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
  } else if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_STALE;
  } else {
    return text;
  }
};

const cacheSet = (url, text) => {
  const [fetchedAtKey, textKey] = cacheKeys(url);

  return Cache.multiSet([
    [fetchedAtKey, String(Date.now())],
    [textKey, text],
  ]);
};

const networkFetch = async url => {
  const resp = await fetch(url);
  const text = await resp.text();

  if (isString(text)) {
    cacheSet(url, text);

    return text;
  }
};

export const fetchNewsFeed = async url => {
  const cacheText = await cacheGet(url).catch(() => CACHE_MISS);
  let textResult;

  if (cacheText === CACHE_MISS || cacheText === CACHE_STALE) {
    textResult = await networkFetch(url).then(Ok, Err);
  } else {
    textResult = Ok(cacheText);
  }

  return textResult.map(parseNewsFeed);
};
