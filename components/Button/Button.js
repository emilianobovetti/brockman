import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export function Button(props) {
  const {
    children,
    onPress,
    elevation = 1,
    style = styles.button,
  } = props;

  return (
    <View elevation={elevation} style={styles.buttonContainer}>
      <TouchableOpacity style={style} onPress={onPress}>
        {children}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
