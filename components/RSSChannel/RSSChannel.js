import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFetch, usePromise } from '@fpc/hooks';
import { parseRSS } from 'RSSParser';
import { Ionicons } from '@expo/vector-icons';
import { RSSItem } from 'components/RSSItem';

const toggle = val => !val;

function channelContent({ link, description, items }) {
  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text>{description}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <FlatList
          data={items}
          keyExtractor={item => item.link}
          renderItem={({ item }) => <RSSItem {...item} />}
        />
      </View>
    </View>
  );
}

export function RSSChannel({ url }) {
  const [expanded, setExpanded] = useState(false);

  const [resp, refetch] = useFetch(url);
  const [result, fetchErr, state] = usePromise(() =>
    resp.then(r => r.text()).then(parseRSS), [resp]
  );

  if (state === 'pending') {
    return (
      <View style={styles.row}>
        <Text style={styles.title}>Loading...</Text>
        <Ionicons name="md-wifi" size={30} color={'#555'} />
      </View>
    );
  }

  const [data, parseErr] = result;

  if (fetchErr != null || parseErr != null) {
    return (
      <View style={styles.row}>
        <Text style={styles.title}>Something went terribly wrong!</Text>
        <Ionicons name="md-bug" size={30} color={'#555'} />
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={() => setExpanded(toggle)}>
        <Text style={styles.title}>{data.title}</Text>
        <Ionicons name={expanded ? 'md-arrow-up' : 'md-arrow-down'} size={30} color={'#555'} />
      </TouchableOpacity>

      {expanded && channelContent(data)}
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
