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
          // The `referencedAssets` prop allows you to load external assets from various sources:
          // - A URI
          // - A bundled asset on the native platform (iOS and Android)
          // - A source loaded directly from JavaScript.
          //
          // This example demonstrates multiple ways to load the same asset from different locations.
          // Note: It's not necessary to store the same asset in all these locations; this is for demonstration purposes.
          //
          // The key of the map is the unique asset identifier (as exported in the Editor),
          // which combines the asset name and its unique identifier.
          // You can optionally exclude the unique identifier, for example, instead of 'Inter-594377', you can use 'Inter'.
          // However, it is recommended to use the full identifier to avoid potential conflicts.
          // Using just the asset name allows you to avoid knowing the unique identifier and gives you more control over naming.
          referencedAssets={{
            'Inter-594377': {
              source: require('../../assets/fonts/Inter-594377.ttf'),
              // source: {
              //   fileName: 'Inter-594377.ttf',
              //   path: 'fonts', // only needed for Android assets
              // },
            },
            'referenced-image-2929282': {
              source: {
                uri: 'https://picsum.photos/id/270/500/500',
              },
              // source: {
              //   fileName: 'referenced-image-2929282.png',
              //   path: 'images', // only needed for Android assets
              // },
            },
            'referenced_audio-2929340': {
              source: require('../../assets/audio/referenced_audio-2929340.wav'),
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
