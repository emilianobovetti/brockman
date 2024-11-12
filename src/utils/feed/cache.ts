import Storage from '@/utils/storage'

export const CACHE_MISS = {}
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 12

type StoredData<T> = { fetchedAt: number; data: T }

export function cacheSet<T>(url: string, data: T): Promise<void> {
  return Storage.setItem(url.trim(), {
    fetchedAt: Date.now(),
    data,
  })
}

export async function cacheGet<T>(url: string): Promise<typeof CACHE_MISS | T> {
  const result = await Storage.getItem(url.trim())

  if (result == null) {
    return CACHE_MISS
  }

  const { fetchedAt, data } = result as StoredData<T>

  // Stale cached data
  if (Date.now() - fetchedAt > CACHE_MAX_AGE) {
    return CACHE_MISS
  }

  return data
}
