import AsyncStorage from '@react-native-community/async-storage';

export default {
  multiGet: keys => AsyncStorage.multiGet(keys),

  multiSet: pairs => AsyncStorage.multiSet(pairs),
};
