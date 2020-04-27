import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AtomEntry } from './AtomEntry';

const toggle = val => !val;

export function AtomFeed({ title, id, link, subtitle, updated, entries }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={() => setExpanded(toggle)}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name={expanded ? 'md-arrow-up' : 'md-arrow-down'} size={30} color={'#555'} />
      </TouchableOpacity>

      {expanded &&
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text>{subtitle}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <FlatList
              data={entries}
              keyExtractor={entry => entry.link}
              renderItem={({ item }) => <AtomEntry {...item} />}
            />
          </View>
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight:'bold',
    color: '#333',
  },
  row:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems:'center',
    backgroundColor: '#ddd',
  },
});
