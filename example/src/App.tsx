import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import AnimationFromUrl from './AnimationFromUrl';
import AnimationFromLocalFile from './AnimationFromLocalFile';
import MultipleAnimations from './MultipleAnimations';
import StateMachine from './StateMachine';

export default function App() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimationFromUrl />
        <AnimationFromLocalFile />
        <MultipleAnimations />
        <StateMachine />
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
});
