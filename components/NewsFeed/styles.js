import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  feedHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6d0705',
    height: 51,
    marginVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  activeFeedHead: {
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  feedTitle: {
    fontSize: 20,
    color: '#fff',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  feedButtonOutline: {
    paddingHorizontal: 7,
    backgroundColor: '#e8e8e8',
  },
  feedButtonContainer: {
    marginVertical: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
  },
  feedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedButtonText: {
    fontSize: 18,
    flex: 0.9,
  },
  feedButtonArrow: {
    color: '#ccc',
  },
});
