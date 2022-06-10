import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, { Alignment, Fit } from 'rive-react-native';

const resourceName = 'hero_editor';

export default function Simple() {
  console.log('Simple');
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          resourceName={resourceName}
          stateMachineName={'Jellyfish'}
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
    height: 300,
  },
});
