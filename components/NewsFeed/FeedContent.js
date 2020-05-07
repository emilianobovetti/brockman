import React, { useState } from 'react';
import { Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from 'components/Button';
import { FeedEntry } from './FeedEntry';
import { styles } from './styles';

const getLink = ({ link }) => link;
const feedEntryRenderer = ({ item }) =>
  <FeedEntry title={item.title} link={item.link} />;

export function FeedContent(props) {
  const [shownEntries, setShownEntries] = useState([]);

  const allEntries = props.entries || props.items || [];
  const allEntriesNum = allEntries.length;
  const shownEntriesNum = shownEntries.length;
  const expanded = allEntriesNum > 0 && shownEntriesNum > 0;

  const hideEntries = () =>
    setShownEntries([]);

  const showMoreEntries = () =>
    setShownEntries(allEntries.slice(0, shownEntriesNum + 5));

  return (
    <>
      <TouchableOpacity
        style={[
          styles.feedHead,
          expanded && styles.activeFeedHead,
        ]}
        onPress={() => expanded ? hideEntries() : showMoreEntries()}
      >
        <Text style={styles.feedTitle}>{props.name}</Text>
      </TouchableOpacity>

      <FlatList
        numColumns={1}
        data={shownEntries}
        keyExtractor={getLink}
        renderItem={feedEntryRenderer}
      />

      {expanded &&
        <Button
          style={{ alignItems: 'center' }}
          onPress={() =>
            shownEntriesNum < allEntriesNum ? showMoreEntries() : hideEntries()
          }
        >
          <Text style={styles.feedButtonText}>
            {shownEntriesNum < allEntriesNum ? 'Show More' : 'Collapse'}
          </Text>
        </Button>
      }
    </>
  );
}
