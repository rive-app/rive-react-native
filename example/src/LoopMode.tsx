import * as React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Rive, { Direction, Fit, LoopMode, RiveRef } from 'rive-react-native';
import { Button, RadioButton } from 'react-native-paper';

export default function LoopModeComponent() {
  const riveRef = React.useRef<RiveRef>(null);
  const [direction, setDirection] = useState(Direction.Auto);

  const reset = () => {
    riveRef.current?.reset();
  };

  const play = (animationName: string, loop = LoopMode.None) => {
    riveRef.current?.play(animationName, loop, direction);
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          autoplay={false}
          fit={Fit.Contain}
          style={styles.animation}
          resourceName={'loopy'}
        />
        <View style={styles.directionRow}>
          <Button mode={'contained'} onPress={reset}>
            Reset
          </Button>
          <RadioButton.Group
            onValueChange={(newValue) =>
              setDirection(
                // @ts-ignore
                Direction[newValue.charAt(0).toUpperCase() + newValue.slice(1)]
              )
            }
            value={direction}
          >
            <View style={styles.radioButtonsWrapper}>
              <View style={styles.radioButtonWrapper}>
                <Text>{'Backwards'}</Text>
                <RadioButton value={'backwards'} />
              </View>
              <View style={styles.radioButtonWrapper}>
                <Text>{'Auto'}</Text>
                <RadioButton value={'auto'} />
              </View>
              <View style={styles.radioButtonWrapper}>
                <Text>{'Forward'}</Text>
                <RadioButton value={'forwards'} />
              </View>
            </View>
          </RadioButton.Group>
        </View>
        <View style={styles.controlsRow}>
          <Text>{'Animation: Rotate 90 deg'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('oneshot');
              }}
            >
              {'Play'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('oneshot', LoopMode.OneShot);
              }}
            >
              {'Oneshot'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('oneshot', LoopMode.Loop);
              }}
            >
              {'Loop'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('oneshot', LoopMode.PingPong);
              }}
            >
              {'Ping Pong'}
            </Button>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <Text>{'Animation: Loop Down'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('loop');
              }}
            >
              {'Play'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('loop', LoopMode.OneShot);
              }}
            >
              {'Oneshot'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('lopp', LoopMode.Loop);
              }}
            >
              {'Loop'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('loop', LoopMode.PingPong);
              }}
            >
              {'Ping Pong'}
            </Button>
          </View>
        </View>
        <View style={styles.controlsRow}>
          <Text>{'Animation: Ping Pong'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('pingpong');
              }}
            >
              {'Play'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('pingpong', LoopMode.OneShot);
              }}
            >
              {'Oneshot'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('pingpong', LoopMode.Loop);
              }}
            >
              {'Loop'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('pingpong', LoopMode.PingPong);
              }}
            >
              {'Ping Pong'}
            </Button>
          </View>
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
  animation: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  directionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  buttonsRow: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  controlsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  radioButtonsWrapper: {
    flexDirection: 'row',
  },
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
});
