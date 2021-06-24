import React, { useRef, useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  RNRiveError,
  RNRiveErrorType,
} from 'rive-react-native';
import { Button, TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function StateTrigger() {
  const riveRef = useRef<RiveRef>(null);
  const riveRefUrl = useRef<RiveRef>(null);
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
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          autoplay={true}
          fit={Fit.Cover}
          style={styles.box}
          resourceName={'ui_swipe_left_to_delete'}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.IncorrectStateMachineName: {
                console.log(`${riveError.message} :((((`);
                return;
              }
              case RNRiveErrorType.IncorrectStateMachineInput: {
                console.log(`${riveError.message} :(((`);
                return;
              }
              default:
                return;
            }
          }}
        />
        <View style={[styles.fill, styles.fullWidth, styles.examplesGap]}>
          <View style={[styles.row, styles.controlsWrapper]}>
            <TextInput
              onChangeText={setThreshold}
              style={styles.thresholdInput}
              label="Swipe Threshold"
              keyboardType="decimal-pad"
              value={threshold.toString()}
            />

            <Button
              onPress={applyThresholdInputState}
              style={[styles.applyButtonGap, styles.center, styles.selfCenter]}
              mode="outlined"
            >
              Apply
            </Button>
          </View>
          <Button onPress={trigger} style={styles.gapButton} mode="contained">
            Trigger Delete
          </Button>
        </View>

        <Rive
          ref={riveRefUrl}
          autoplay
          fit={Fit.Cover}
          style={styles.box}
          url="https://cdn.rive.app/animations/pulsar.riv"
        />
        <View style={[styles.fill, styles.fullWidth]}>
          <Button
            onPress={() => {
              riveRefUrl.current?.fireState('Pulsate', 'startPulse');
            }}
            style={styles.gapButton}
            mode="contained"
          >
            Trigger pulse
          </Button>
        </View>
      </KeyboardAwareScrollView>
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

  box: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
  fill: {
    flex: 1,
  },
  controlsWrapper: {
    maxHeight: 150,
  },
  thresholdInput: {
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
  selfCenter: {
    alignSelf: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  examplesGap: {
    marginBottom: 20,
  },
});
