import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import Rive, { Fit } from 'rive-react-native';

export default function StateMachine() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          autoplay={true}
          fit={Fit.Cover}
          style={styles.box}
          stateMachineName="State Machine 2"
          artboardName="Picture 1"
          initialAssetsHandled={{
            'cat.webp': {
              // assetUrl: 'https://www.gstatic.com/webp/gallery/1.webp',
              bundledAssetName:
                Platform.OS === 'ios' ? 'cat_994454.webp' : 'cat_994454',
            },
          }}
          resourceName={'cat_wall'}
        />
        <Text>
          Load in an external asset from a URL or bundled asset on the native
          platform
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
    padding: 10,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  box: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  radioButtonsWrapper: {
    flexDirection: 'row',
  },
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
});
