import Storage from '@/storage';

const CACHE_PREFIX = 'CACHE-URL:';
export const CACHE_MISS = {};
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 12;

type StoredData<T> = { fetchedAt: number; data: T };

export function cacheSet<T>(url: string, data: T): Promise<void> {
  return Storage.setItem(getKey(url), {
    fetchedAt: Date.now(),
    data,
  });
}

export async function cacheGet<T>(url: string): Promise<typeof CACHE_MISS | T> {
  const result = await Storage.getItem(getKey(url));

  if (result == null) {
    return CACHE_MISS;
  }

  const { fetchedAt, data } = result as StoredData<T>;

  // Stale cached data
  if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_MISS;
  }

  return data;
}

export async function cacheClear(): Promise<void> {
  const keys = await Storage.getAllKeys();

  for (const key of keys) {
    if (key.startsWith(CACHE_PREFIX)) {
      Storage.removeItem(key);
    }
  }
}

function getKey(url: string) {
  return CACHE_PREFIX + url.trim();
}
