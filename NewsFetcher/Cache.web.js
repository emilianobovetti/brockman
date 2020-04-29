/* global Promise, localStorage */

export default {
  multiGet: keys =>
    new Promise(resolve =>
      resolve(keys.map(key => [key, localStorage.getItem(key)]))
    ),

  multiSet: pairs =>
    new Promise(resolve =>
      resolve(pairs.forEach(([key, value]) => localStorage.setItem(key, value)))
    ),
};
