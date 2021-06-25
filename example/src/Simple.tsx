import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, { Alignment, Fit } from 'rive-react-native';

const resourceName = 'truck_v7';

export default function Simple() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          resourceName={resourceName}
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
