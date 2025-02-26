import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Rive from 'rive-react-native';

const url =
  'https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv';

export default function Http() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          url={url}
          artboardName={'Avatar 3'}
          stateMachineName={'avatar3'}
          style={styles.animation}
          autoplay={true}
          onPlay={(name, isSM) => {
            console.log('PLAY: NAME + SM', name, isSM);
          }}
          onStop={(name, isSM) => {
            console.log('STOP: NAME + SM', name, isSM);
          }}
          onPause={(name, isSM) => {
            console.log('PAUSE: NAME + SM', name, isSM);
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
    marginBottom: 150,
  },
  animation: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
});
