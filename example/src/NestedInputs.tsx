import * as React from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, { Alignment, RiveRef } from 'rive-react-native';

export default function NestedInputs() {
  const riveRef = React.useRef<RiveRef>(null);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button
          title="Outer Cicle On"
          onPress={() => {
            riveRef.current?.setInputStateAtPath(
              'CircleOuterState',
              true,
              'CircleOuter' // artboard path to input
            );
          }}
        />
        <Button
          title="Outer Cicle Off"
          onPress={() => {
            riveRef.current?.setInputStateAtPath(
              'CircleOuterState',
              false,
              'CircleOuter' // artboard path to input
            );
          }}
        />
        <Button
          title="Inner Cicle On"
          onPress={() => {
            riveRef.current?.setInputStateAtPath(
              'CircleInnerState',
              true,
              'CircleOuter/CircleInner' // artboard path to input
            );
          }}
        />
        <Button
          title="Inner Cicle Off"
          onPress={() => {
            riveRef.current?.setInputStateAtPath(
              'CircleInnerState',
              false,
              'CircleOuter/CircleInner' // artboard path to input
            );
          }}
        />
        <Rive
          ref={riveRef}
          alignment={Alignment.Center}
          style={styles.animation}
          autoplay={true}
          stateMachineName="MainStateMachine"
          resourceName={'runtime_nested_inputs'}
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
