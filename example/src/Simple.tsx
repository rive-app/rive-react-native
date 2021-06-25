import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, {
  Alignment,
  Fit,
  RNRiveError,
  RNRiveErrorType,
} from 'rive-react-native';
// const resourceName = 'v6_file';
const resourceName = 'truck_v7';

export default function Simple() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          animationName="dupa"
          resourceName={resourceName}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.IncorrectAnimationName: {
                console.log('IncorrectAnimationName :(');
                return;
              }
              case RNRiveErrorType.FileNotFound: {
                console.log('File not found :(');
                return;
              }
              case RNRiveErrorType.UnsupportedRuntimeVersion: {
                console.log('Runtime version unsupported :((((');
                return;
              }
            }
          }}
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
  },
  animation: {
    width: '100%',
    height: 600,
  },
});
