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
  feedButtonContainer: {
    paddingHorizontal: 7,
    backgroundColor: '#f3f3f3',
  },
  feedButtonView: {
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
    flex: 0.92,
  },
  feedButtonArrow: {
    flex: 0.03,
    color: '#ccc',
  },
});
