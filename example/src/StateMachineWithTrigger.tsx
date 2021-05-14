import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

export default function StateMachineWithTrigger() {
  const autoplay = false;
  const [isPlaying, setPlaying] = React.useState(autoplay);
  const riveRef = React.useRef<RiveRef>(null);

  const toggleAnimation = () => {
    isPlaying ? riveRef.current?.pause() : riveRef.current?.play();
    setPlaying((prev) => !prev);
  };

  const fireStateMachineTrigger = () => {
    riveRef.current?.fireState('Swipe to delete', 'Trigger Delete');
    setPlaying(false);
  };

  const applyThreshold = () => {
    riveRef.current?.setInputState('Swipe to delete', 'Swipe Threshold', 50);
  };
  return (
    <>
      <Rive
        ref={riveRef}
        autoplay={autoplay}
        onPlay={(animationName, isStateMachine) => {
          console.log('played animation name :', animationName, isStateMachine);
        }}
        onPause={(animationName, isStateMachine) => {
          console.log('paused animation name :', animationName, isStateMachine);
        }}
        onStop={(animationName, isStateMachine) => {
          console.log(
            'stopped animation name :',
            animationName,
            isStateMachine
          );
        }}
        onLoopEnd={(animationName, isStateMachine) => {
          console.log(
            'loop ended animation name :',
            animationName,
            isStateMachine
          );
        }}
        onStateChanged={(layerState) => {
          console.log('state changed', layerState);
        }}
        style={styles.box}
        resourceName="ui_swipe_left_to_delete"
      />
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button} onPress={toggleAnimation}>
          <Text style={styles.buttonText}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={fireStateMachineTrigger}
        >
          <Text style={styles.buttonText}>Trigger</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={applyThreshold}>
          <Text style={styles.buttonText}>Apply threshold</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  box: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
  button: {
    height: 40,
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    paddingLeft: 5,
    paddingRight: 5,
  },
});
