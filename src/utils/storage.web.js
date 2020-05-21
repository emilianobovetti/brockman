/* global Promise, localStorage */

const getItem = key => new Promise(resolve =>
  resolve(localStorage.getItem(key))
);

const setItem = (key, value) => new Promise(resolve =>
  resolve(localStorage.setItem(key, value))
);

const removeItem = key => new Promise(resolve =>
  resolve(localStorage.removeItem(key))
);

const multiGet = keys => Promise.all(
  keys.map(key => getItem(key).then(value => [key, value]))
);

const multiSet = pairs => Promise.all(
  pairs.map(([key, value]) => setItem(key,value))
);

const multiRemove = keys => Promise.all(
  keys.map(key => removeItem(key))
);

const getAllKeys = () => new Promise(resolve =>
  resolve(Object.keys(localStorage))
);

const clear = () => new Promise(resolve =>
  resolve(localStorage.clear())
);

export default {
  getItem,
  setItem,
  removeItem,
  multiGet,
  multiSet,
  multiRemove,
  getAllKeys,
  clear,
};
