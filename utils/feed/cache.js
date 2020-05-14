import Cache from 'utils/cache';

export const CACHE_MISS = {};
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

const cacheKeys = url => {
  const key = url.trim();

  return [`${key}:fetchedAt`, `${key}:text`];
};

export const cacheSet = (url, text) => {
  const [fetchedAtKey, textKey] = cacheKeys(url);

  return Cache.multiSet([
    [fetchedAtKey, String(Date.now())],
    [textKey, text],
  ]);
};

export const cacheGet = async url => {
  const [fst = [], snd = []] = await Cache.multiGet(cacheKeys(url));
  const [, timestamp] = fst;
  const [, text] = snd;
  const fetchedAt = parseInt(timestamp, 10);

  if (isNaN(fetchedAt)) {
    return CACHE_MISS;
  }

  // Stale cached data
  if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_MISS;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return CACHE_MISS;
  }
};
