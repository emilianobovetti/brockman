import Storage from 'utils/storage';

export const CACHE_MISS = {};
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

export const cacheSet = (url, data) =>
  Storage.setItem(url.trim(), JSON.stringify({
    fetchedAt: Date.now(),
    data,
  }));

export const cacheGet = async url => {
  const rawText = await Storage.getItem(url.trim());

  if (rawText == null) {
    return CACHE_MISS;
  }

  const { fetchedAt, data } = JSON.parse(rawText);

  // Stale cached data
  if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_MISS;
  }

  return data;
};
