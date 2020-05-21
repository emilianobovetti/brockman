import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FeedEntry } from 'components/FeedEntry';
import styles from 'components/sharedStyles';

const getLink = ({ link }) => link;
const feedEntryRenderer = ({ item }) =>
  <FeedEntry title={item.title} link={item.link} />;

export function FeedContent(props) {
  const [shownEntries, setShownEntries] = useState([]);

  const allEntries = props.entries || props.items || [];
  const allEntriesNum = allEntries.length;
  const shownEntriesNum = shownEntries.length;
  const isExpanded = allEntriesNum > 0 && shownEntriesNum > 0;

  const hideEntries = () =>
    setShownEntries([]);

  const showMoreEntries = () =>
    setShownEntries(allEntries.slice(0, shownEntriesNum + 5));

  return (
    <>
      <TouchableOpacity
        style={[
          styles.feedHead,
          isExpanded && styles.activeFeedHead,
        ]}
        onPress={() => isExpanded ? hideEntries() : showMoreEntries()}
      >
        <Text style={styles.feedTitle}>{props.name}</Text>
      </TouchableOpacity>

      <FlatList
        numColumns={1}
        data={shownEntries}
        keyExtractor={getLink}
        renderItem={feedEntryRenderer}
      />

      {isExpanded &&
        <View elevation={1} style={styles.showMoreContainer}>
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={() =>
              shownEntriesNum < allEntriesNum ? showMoreEntries() : hideEntries()
            }
          >
            <Text style={styles.showMoreText}>
              {shownEntriesNum < allEntriesNum ? 'Show More' : 'Collapse'}
            </Text>
          </TouchableOpacity>
        </View>
      }
    </>
  );
}
