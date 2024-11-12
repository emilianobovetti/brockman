import Storage from '@/utils/storage';

export const CACHE_MISS = {};
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

export const cacheSet = (url, data) =>
  Storage.setItem(url.trim(), {
    fetchedAt: Date.now(),
    data,
  });

export const cacheGet = async (url) => {
  const result = await Storage.getItem(url.trim());

  if (result == null) {
    return CACHE_MISS;
  }

  const { fetchedAt, data } = result;

  // Stale cached data
  if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_MISS;
  }

  return data;
};
