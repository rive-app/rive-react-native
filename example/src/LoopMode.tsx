import * as React from 'react';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Rive, { Direction, Fit, LoopMode, RiveRef } from 'rive-react-native';
import { Button, RadioButton } from 'react-native-paper';
import { isEnumKey } from './typesPredicates';

export default function LoopModeComponent() {
  const riveRef = React.useRef<RiveRef>(null);

  const [rotateDirection, setRotateDirection] = useState(Direction.Auto);
  const [loopDownDirection, setLoopDownDirection] = useState(Direction.Auto);
  const [pingPongDirection, setPingPongDirection] = useState(Direction.Auto);

  const [rotateLoop, setRotateLoop] = useState(LoopMode.None);
  const [loopDownLoop, setLoopDownLoop] = useState(LoopMode.None);
  const [pingPongLoop, setPingPongLoop] = useState(LoopMode.None);

  const reset = () => {
    riveRef.current?.reset();
  };

  const play = (
    animationName: string,
    loop = LoopMode.None,
    direction = Direction.Auto
  ) => {
    riveRef.current?.play(animationName, loop, direction);
  };

  const pause = (animationName: string) => {
    riveRef.current?.pause(animationName);
  };

  const stop = (animationName: string) => {
    riveRef.current?.stop(animationName);
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
        <Button mode={'contained'} onPress={reset} style={styles.resetButton}>
          Reset
        </Button>
        <View style={styles.controls}>
          <Text style={styles.animationName}>{'Animation: Rotate 90 deg'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('oneshot', rotateLoop, rotateDirection);
              }}
            >
              {'Play'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                pause('oneshot');
              }}
            >
              {'Pause'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                stop('oneshot');
              }}
            >
              {'Stop'}
            </Button>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                const enumKey =
                  newValue.charAt(0).toUpperCase() + newValue.slice(1);
                if (isEnumKey(Direction, enumKey)) {
                  setRotateDirection(Direction[enumKey]);
                }
              }}
              value={rotateDirection}
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
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                const enumKey =
                  newValue.charAt(0).toUpperCase() + newValue.slice(1);
                if (isEnumKey(LoopMode, enumKey)) {
                  setRotateLoop(LoopMode[enumKey]);
                }
              }}
              value={rotateLoop}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Oneshot'}</Text>
                  <RadioButton value={'oneShot'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Loop'}</Text>
                  <RadioButton value={'loop'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'PingPong'}</Text>
                  <RadioButton value={'pingPong'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'None'}</Text>
                  <RadioButton value={'none'} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>

        <View style={styles.controls}>
          <Text style={styles.animationName}>{'Animation: Loop Down'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('loop', rotateLoop, rotateDirection);
              }}
            >
              {'Play'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                pause('loop');
              }}
            >
              {'Pause'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                stop('loop');
              }}
            >
              {'Stop'}
            </Button>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                const enumKey =
                  newValue.charAt(0).toUpperCase() + newValue.slice(1);
                if (isEnumKey(Direction, enumKey)) {
                  setLoopDownDirection(Direction[enumKey]);
                }
              }}
              value={loopDownDirection}
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
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                const enumKey =
                  newValue.charAt(0).toUpperCase() + newValue.slice(1);
                if (isEnumKey(LoopMode, enumKey)) {
                  setLoopDownLoop(LoopMode[enumKey]);
                }
              }}
              value={loopDownLoop}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Oneshot'}</Text>
                  <RadioButton value={'oneShot'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Loop'}</Text>
                  <RadioButton value={'loop'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'PingPong'}</Text>
                  <RadioButton value={'pingPong'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'None'}</Text>
                  <RadioButton value={'none'} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>

        <View style={styles.controls}>
          <Text style={styles.animationName}>{'Animation: Ping Pong'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                play('pingpong', rotateLoop, rotateDirection);
              }}
            >
              {'Play'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                pause('pingpong');
              }}
            >
              {'Pause'}
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                stop('pingpong');
              }}
            >
              {'Stop'}
            </Button>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                const enumKey =
                  newValue.charAt(0).toUpperCase() + newValue.slice(1);
                if (isEnumKey(Direction, enumKey)) {
                  setPingPongDirection(Direction[enumKey]);
                }
              }}
              value={pingPongDirection}
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
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                const enumKey =
                  newValue.charAt(0).toUpperCase() + newValue.slice(1);
                if (isEnumKey(LoopMode, enumKey)) {
                  setPingPongLoop(LoopMode[enumKey]);
                }
              }}
              value={pingPongLoop}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Oneshot'}</Text>
                  <RadioButton value={'oneShot'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Loop'}</Text>
                  <RadioButton value={'loop'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'PingPong'}</Text>
                  <RadioButton value={'pingPong'} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'None'}</Text>
                  <RadioButton value={'none'} />
                </View>
              </View>
            </RadioButton.Group>
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
  resetButton: {
    marginBottom: 16,
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
  animationName: {
    textAlign: 'center',
    marginRight: 32,
  },
  buttonsRow: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  controls: {
    flex: 1,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: 'black',
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
