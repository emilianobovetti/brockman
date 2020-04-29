import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { FeedEntry } from './FeedEntry';
import { styles } from './styles';

const toggle = val => !val;

export function FeedContent(props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.feedRow,
          expanded && styles.activeFeedRow,
        ]}
        onPress={() => setExpanded(toggle)}
      >
        <Text style={styles.feedTitle}>{props.name}</Text>
      </TouchableOpacity>

      {expanded &&
        <View style={styles.feedContent}>
          {/*<Text style={styles.feedTitle}>{props.subtitle || props.description}</Text>*/}
          {/*<Separator />*/}
          <FlatList
            numColumns={1}
            contentContainerStyle={{ flexDirection: 'row' }}
            data={props.entries || props.items}
            keyExtractor={item => item.link}
            renderItem={({ item }) => <FeedEntry {...item} />}
          />
        </View>
      }
    </>
  );
}
