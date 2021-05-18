import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import Rive, { Fit } from 'rive-react-native';

export default function MultipleArtboards() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Square - go around</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Square'}
          animationName={'goaround'}
          resourceName={'artboard_animations'}
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
    height: 200,
    marginTop: 16,
    marginBottom: 32,
  },
});
