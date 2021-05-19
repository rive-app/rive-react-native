import * as React from 'react';
import { useRef, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Rive, { RiveRef, Fit } from 'rive-react-native';

const BUTTONS = ['stop', 'pause', 'play'] as const;
type ButtonKeys = typeof BUTTONS[number];

export default function MultipleAnimations() {
  const riveRef = useRef<RiveRef>(null);
  const [activeButtonRollaround, setActiveButtonRollaround] =
    useState<ButtonKeys>('stop');
  const [activeButtonGoaround, setActiveButtonGoaround] =
    useState<ButtonKeys>('stop');

  const playRollaround = () => {
    setActiveButtonRollaround('play');
    riveRef.current?.play('rollaround');
  };

  const pauseRollaround = () => {
    setActiveButtonRollaround('pause');
    riveRef.current?.pause('rollaround');
  };

  const stopRollaround = () => {
    setActiveButtonRollaround('stop');
    riveRef.current?.stop('rollaround');
  };

  const reset = () => {
    riveRef.current?.reset();
    setActiveButtonRollaround('stop');
    setActiveButtonGoaround('stop');
  };

  const playGoaround = () => {
    setActiveButtonGoaround('play');
    riveRef.current?.play('goaround');
  };

  const pauseGoaround = () => {
    setActiveButtonGoaround('pause');
    riveRef.current?.pause('goaround');
  };

  const stopGoaround = () => {
    setActiveButtonGoaround('stop');
    riveRef.current?.stop('goaround');
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          onStop={(animationName: string) => {
            if (animationName === 'goaround') {
              setActiveButtonGoaround('stop');
            } else {
              setActiveButtonRollaround('stop');
            }
          }}
          onPause={(animationName: string) => {
            if (animationName === 'goaround') {
              setActiveButtonGoaround('pause');
            } else {
              setActiveButtonRollaround('pause');
            }
          }}
          autoplay={false}
          fit={Fit.Cover}
          style={styles.box}
          resourceName={'artboard_animations'}
        />
        <View style={styles.controls}>
          <Button style={styles.resetButton} mode="contained" onPress={reset}>
            Reset
          </Button>
          <View style={[styles.controlsRow]}>
            <Text>Rollaround: </Text>
            <View style={styles.row}>
              <Button
                color={
                  activeButtonRollaround === 'play' ? 'lightgreen' : 'white'
                }
                mode="contained"
                onPress={playRollaround}
              >
                {'>'}
              </Button>
              <Button
                style={styles.controlButtonGap}
                color={activeButtonRollaround === 'pause' ? 'blue' : 'white'}
                mode="contained"
                onPress={pauseRollaround}
              >
                ||
              </Button>
              <Button
                style={styles.controlButtonGap}
                color={activeButtonRollaround === 'stop' ? 'red' : 'white'}
                mode="contained"
                onPress={stopRollaround}
              >
                []
              </Button>
            </View>
          </View>
          <View style={[styles.controlsRow, styles.controlsRowGap]}>
            <Text>Goaround: </Text>
            <View style={styles.row}>
              <Button
                color={activeButtonGoaround === 'play' ? 'lightgreen' : 'white'}
                mode="contained"
                onPress={playGoaround}
              >
                {'>'}
              </Button>
              <Button
                style={styles.controlButtonGap}
                color={activeButtonGoaround === 'pause' ? 'blue' : 'white'}
                mode="contained"
                onPress={pauseGoaround}
              >
                ||
              </Button>
              <Button
                style={styles.controlButtonGap}
                color={activeButtonGoaround === 'stop' ? 'red' : 'white'}
                mode="contained"
                onPress={stopGoaround}
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
    height: 400,
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

  controlsRowGap: {
    marginTop: 8,
  },
});
