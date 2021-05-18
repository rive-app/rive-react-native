import * as React from 'react';
import { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';
import { Button, Text } from 'react-native-paper';

const BUTTONS = ['stop', 'play', 'pause'] as const;
type ButtonsKey = typeof BUTTONS[number];

export default function SimpleControls() {
  const [activeButton, setActiveButton] = useState<ButtonsKey>('stop');

  const riveRef = useRef<RiveRef>(null);

  const playAnimation = () => {
    setActiveButton('play');
    riveRef.current?.play();
  };

  const pauseAnimation = () => {
    setActiveButton('pause');
    riveRef.current?.pause();
  };

  const stopAnimation = () => {
    setActiveButton('stop');
    riveRef.current?.stop();
  };

  const reset = () => {
    riveRef.current?.reset();
    setActiveButton('stop');
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          style={styles.box}
          autoplay={false}
          resourceName={'flying_car'}
        />

        <View style={styles.controls}>
          <Button style={styles.resetButton} mode="contained" onPress={reset}>
            Reset
          </Button>
          <View style={styles.controlsRow}>
            <Text>Animation: </Text>
            <View style={styles.row}>
              <Button
                color={activeButton === 'play' ? 'lightgreen' : 'white'}
                mode="contained"
                onPress={playAnimation}
              >
                {'>'}
              </Button>
              <Button
                style={styles.controlButtonGap}
                color={activeButton === 'pause' ? 'blue' : 'white'}
                mode="contained"
                onPress={pauseAnimation}
              >
                ||
              </Button>
              <Button
                style={styles.controlButtonGap}
                color={activeButton === 'stop' ? 'red' : 'white'}
                mode="contained"
                onPress={stopAnimation}
              >
                []
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  controls: {
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: 'stretch',
  },
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
  row: {
    flexDirection: 'row',
  },
  controlButtonGap: {
    marginLeft: 8,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
});
