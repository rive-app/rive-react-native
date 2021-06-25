import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import Rive, { Fit, RNRiveError, RNRiveErrorType } from 'rive-react-native';

export default function MultipleArtboards() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Square - go around</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Squares'}
          animationName={'goaroundsssss'}
          resourceName={'artboard_animations'}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.IncorrectArtboardName: {
                console.log(`${riveError.message} :((((`);
                return;
              }
              default:
                return;
            }
          }}
        />

        <Text>Square - roll around</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Square'}
          resourceName={'artboard_animations'}
        />

        <Text>Circle</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Circle'}
          resourceName={'artboard_animations'}
        />

        <Text>Star</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Star'}
          resourceName={'artboard_animations'}
        />
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
    paddingTop: 32,
  },
  animation: {
    width: '100%',
    height: 300,
    marginTop: 16,
    marginBottom: 32,
  },
});
