/* From: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB */
const indexedDB = window.indexedDB

if (indexedDB == null) {
  throw new Error('IndexedDB not supported')
}

function deferredRequest<T>(dbRequest: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    dbRequest.addEventListener('error', reject)
    dbRequest.addEventListener('success', event =>
      resolve((event.target as IDBRequest<T>).result)
    )
  })
}

const DB_NAME = 'AsyncStorage'
const DB_STORE_NAME = 'KeyValue'
const READ_ONLY = 'readonly'
const READ_WRITE = 'readwrite'

const openDbReq = indexedDB.open(DB_NAME)
const openDbReqPromise = deferredRequest<IDBDatabase>(openDbReq)

openDbReq.addEventListener<'upgradeneeded'>('upgradeneeded', event => {
  const db = (event.target as IDBRequest<IDBDatabase>).result
  db.createObjectStore(DB_STORE_NAME, { keyPath: 'key' })
})

function getKVStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  return openDbReqPromise.then(db =>
    db.transaction(DB_STORE_NAME, mode).objectStore(DB_STORE_NAME)
  )
}

function getItem<T>(key: any): Promise<T> {
  return getKVStore(READ_ONLY)
    .then(store => deferredRequest(store.get(key)))
    .then(res => (res == null ? res : res.value))
}

function setItem(key: any, value: any): Promise<IDBValidKey> {
  return getKVStore(READ_WRITE).then(store =>
    deferredRequest(store.put({ key, value }))
  )
}

function removeItem(key: any): Promise<void> {
  return getKVStore(READ_WRITE).then(store =>
    deferredRequest(store.delete(key))
  )
}

function getAllKeys(): Promise<IDBValidKey[]> {
  return getKVStore(READ_ONLY).then(store =>
    deferredRequest(store.getAllKeys())
  )
}

function clear(): Promise<void> {
  return getKVStore(READ_WRITE).then(store => deferredRequest(store.clear()))
}

export default {
  getItem,
  setItem,
  removeItem,
  getAllKeys,
  clear,
}
