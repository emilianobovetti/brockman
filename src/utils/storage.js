import AsyncStorage from '@react-native-async-storage/async-storage';

const getItem = key =>
  AsyncStorage.getItem(key).then(value =>
    typeof value === 'string' ? JSON.parse(value) : value
  );

const setItem = (key, value) =>
  AsyncStorage.setItem(key, JSON.stringify(value));

const removeItem = key =>
  AsyncStorage.removeItem(key);

const getAllKeys = () =>
  AsyncStorage.getAllKeys();

const clear = () =>
  AsyncStorage.clear();

export default {
  getItem,
  setItem,
  removeItem,
  getAllKeys,
  clear,
};
