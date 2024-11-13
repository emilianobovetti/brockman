import { StyleSheet } from 'react-native';

const buttonContainer = {
  marginVertical: 5,
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: '#fff',
  borderRadius: 3,
  borderWidth: 1,
  borderColor: '#eee',
};

const buttonText = {
  fontSize: 18,
  flex: 0.9,
};

const styles = StyleSheet.create({
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
  feedIcon: {
    color: '#fff',
  },
  feedButtonOutline: {
    paddingHorizontal: 7,
    backgroundColor: '#e8e8e8',
  },
  feedButtonContainer: buttonContainer,
  feedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedButtonText: buttonText,
  showMoreContainer: buttonContainer,
  showMoreButton: {
    alignItems: 'center',
  },
  showMoreText: buttonText,
});

export default styles;
