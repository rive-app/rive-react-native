import React, { useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { Button, TextInput } from 'react-native-paper';

export default function StateTrigger() {
  const riveRef = useRef<RiveRef>(null);
  const [threshold, setThreshold] = useState('0.0');
  const applyThresholdInputState = () => {
    riveRef.current?.setInputState(
      'Swipe to delete',
      'Swipe Threshold',
      parseFloat(threshold)
    );
  };

  const trigger = () => {
    riveRef.current?.fireState('Swipe to delete', 'Trigger Delete');
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          autoplay={true}
          fit={Fit.Cover}
          style={styles.box}
          resourceName={'ui_swipe_left_to_delete'}
        />
        <View style={[styles.fill, styles.fullWidth]}>
          <View style={[styles.row, styles.fill]}>
            <TextInput
              onChangeText={setThreshold}
              style={styles.fill}
              label="Swipe Threshold"
              keyboardType="decimal-pad"
              value={threshold.toString()}
            />

            <Button
              onPress={applyThresholdInputState}
              style={[styles.applyButtonGap, styles.center]}
              mode="outlined"
            >
              Apply
            </Button>
          </View>
          <Button onPress={trigger} style={styles.gapButton} mode="contained">
            Trigger Delete
          </Button>
        </View>
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
  box: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
  fill: {
    flex: 1,
  },
  fullWidth: {
    minWidth: 300,
  },
  gapButton: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  applyButtonGap: {
    marginLeft: 20,
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
