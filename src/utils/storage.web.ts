/* From: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB */
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

if (indexedDB == null) {
  throw new Error('IndexedDB not supported');
}

const deferredRequest = dbRequest => new Promise((resolve, reject) => {
  dbRequest.addEventListener('error', reject);
  dbRequest.addEventListener('success', event =>
    resolve(event.target.result),
  );
});

const DB_NAME = 'AsyncStorage';
const DB_STORE_NAME = 'KeyValue';
const READ_ONLY = 'readonly';
const READ_WRITE = 'readwrite';

const openDbReq = indexedDB.open(DB_NAME);
const openDbReqPromise = deferredRequest(openDbReq);

openDbReq.addEventListener('upgradeneeded', event => {
  const db = event.target.result;
  db.createObjectStore(DB_STORE_NAME, { keyPath: 'key' });
});

const getKVStore = mode =>
  openDbReqPromise.then(db =>
    db.transaction(DB_STORE_NAME, mode).objectStore(DB_STORE_NAME),
  );

const getItem = key =>
  getKVStore(READ_ONLY)
    .then(store => deferredRequest(store.get(key)))
    .then(res => res == null ? res : res.value);

const setItem = (key, value) =>
  getKVStore(READ_WRITE)
    .then(store => deferredRequest(store.put({ key, value })));

const removeItem = key =>
  getKVStore(READ_WRITE)
    .then(store => deferredRequest(store.delete(key)));

const getAllKeys = () =>
  getKVStore(READ_ONLY)
    .then(store => deferredRequest(store.getAllKeys()));

const clear = () =>
  getKVStore(READ_WRITE)
    .then(store => deferredRequest(store.clear()));

export default {
  getItem,
  setItem,
  removeItem,
  getAllKeys,
  clear,
};
