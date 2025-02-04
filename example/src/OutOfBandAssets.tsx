import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import Rive, { Fit, RNRiveError } from 'rive-react-native';

export default function StateMachine() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          autoplay={true}
          fit={Fit.Contain}
          style={styles.box}
          stateMachineName="State Machine 1"
          // You can use the `referencedAssets` prop to load in external assets from a URI
          // or bundled asset on the native platform (iOS and Android)
          // or as a source loaded directly from JavaScript.
          //
          // Below demonstrates various ways to load in the same asset
          // located in different places. Its not needed to store the same
          // asset in all these locations, but this example does that for
          // demonstration purposes.
          //
          // The key of the map is the unique asset identifier (as exported in the Editor),
          // which is a combination of the asset name and its unique identifier.
          referencedAssets={{
            'Inter-594377': {
              source: require('./assets/Inter-594377.ttf'),
              // source: {
              //   fileName: 'Feather.ttf',
              //   path: 'fonts', // only needed for Android assets
              // },
            },
            'referenced-image-2929282': {
              source: require('./assets/referenced-image-2929282.png'),
              // source: {
              //   uri: 'https://picsum.photos/id/270/500/500',
              // },
              // source: {
              //   fileName: 'referenced-image-2929282.png',
              //   path: 'images', // only needed for Android assets
              // },
            },
            'referenced_audio-2929340': {
              source: require('./assets/referenced_audio-2929340.wav'),
              // source: {
              //   fileName: 'referenced_audio-2929340.wav',
              //   path: 'audio', // only needed for Android assets
              // },
            },
          }}
          artboardName="Artboard"
          resourceName={'out_of_band'}
          onError={(riveError: RNRiveError) => {
            console.log(riveError);
          }}
        />
        <Text>
          Load in an external asset from a URL, or bundled asset on the native
          platform, or as a source loaded directly from JavaScript.
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
  box: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
});
