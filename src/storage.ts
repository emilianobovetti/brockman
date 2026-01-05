import AsyncStorage from '@react-native-async-storage/async-storage';

async function getItem<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);

  return typeof value === 'string' ? JSON.parse(value) : value;
}

function setItem(key: string, value: any): Promise<void> {
  return AsyncStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key: string): Promise<void> {
  return AsyncStorage.removeItem(key);
}

function getAllKeys(): Promise<readonly string[]> {
  return AsyncStorage.getAllKeys();
}

function clear(): Promise<void> {
  return AsyncStorage.clear();
}

export default {
  getItem,
  setItem,
  removeItem,
  getAllKeys,
  clear,
};
