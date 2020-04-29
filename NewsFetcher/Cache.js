import { AsyncStorage } from 'react-native';

export default {
  multiGet: keys => AsyncStorage.multiGet(keys),

  multiSet: pairs => AsyncStorage.multiSet(pairs),
};
