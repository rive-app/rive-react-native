import * as React from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive, { Direction, Fit, LoopMode, RiveRef } from 'rive-react-native';
import { Button, RadioButton } from 'react-native-paper';
import { isEnum } from './typesPredicates';

const BUTTONS = ['stop', 'pause', 'play'] as const;
type ButtonKeys = typeof BUTTONS[number];

export default function LoopModeComponent() {
  const riveRef = React.useRef<RiveRef>(null);

  const [rotateActiveButton, setRotateActiveButton] =
    useState<ButtonKeys>('stop');
  const [loopDownActiveButton, setLoopDownActiveButton] =
    useState<ButtonKeys>('stop');
  const [pingPongActiveButton, setPingPongActiveButton] =
    useState<ButtonKeys>('stop');
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
      <Rive
        ref={riveRef}
        onPause={(animationName) => {
          switch (animationName) {
            case 'oneshot': {
              setRotateActiveButton('pause');
              break;
            }
            case 'loop': {
              setLoopDownActiveButton('pause');
              break;
            }

            case 'pingpong': {
              setPingPongActiveButton('pause');
              break;
            }
          }
        }}
        onStop={(animationName) => {
          switch (animationName) {
            case 'oneshot': {
              setRotateActiveButton('stop');
              break;
            }
            case 'loop': {
              setLoopDownActiveButton('stop');
              break;
            }

            case 'pingpong': {
              setPingPongActiveButton('stop');
              break;
            }
          }
        }}
        autoplay={false}
        fit={Fit.Contain}
        style={styles.animation}
        resourceName={'loopy'}
      />
      <Button mode={'contained'} onPress={reset} style={styles.resetButton}>
        Reset
      </Button>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.controls}>
          <Text style={styles.animationName}>{'Animation: Rotate 90 deg'}</Text>
          <View style={styles.buttonsRow}>
            <Button
              mode="contained"
              color={rotateActiveButton === 'play' ? 'lightgreen' : 'white'}
              style={styles.button}
              onPress={() => {
                play('oneshot', rotateLoop, rotateDirection);
                setRotateActiveButton('play');
              }}
            >
              {'>'}
            </Button>
            <Button
              mode="contained"
              color={rotateActiveButton === 'pause' ? 'blue' : 'white'}
              style={styles.button}
              onPress={() => {
                pause('oneshot');
                setRotateActiveButton('pause');
              }}
            >
              ||
            </Button>
            <Button
              mode="contained"
              color={rotateActiveButton === 'stop' ? 'red' : 'white'}
              style={styles.button}
              onPress={() => {
                stop('oneshot');
                setRotateActiveButton('stop');
              }}
            >
              []
            </Button>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (isEnum(Direction, newValue)) {
                  setRotateDirection(newValue);
                }
              }}
              value={rotateDirection}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Backwards'}</Text>
                  <RadioButton value={Direction.Backwards} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Auto'}</Text>
                  <RadioButton value={Direction.Auto} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Forward'}</Text>
                  <RadioButton value={Direction.Forwards} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (isEnum(LoopMode, newValue)) {
                  setRotateLoop(newValue);
                }
              }}
              value={rotateLoop}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Oneshot'}</Text>
                  <RadioButton value={LoopMode.OneShot} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Loop'}</Text>
                  <RadioButton value={LoopMode.Loop} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'PingPong'}</Text>
                  <RadioButton value={LoopMode.PingPong} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'None'}</Text>
                  <RadioButton value={LoopMode.None} />
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
              color={loopDownActiveButton === 'play' ? 'lightgreen' : 'white'}
              style={styles.button}
              onPress={() => {
                play('loop', loopDownLoop, loopDownDirection);
                setLoopDownActiveButton('play');
              }}
            >
              {'>'}
            </Button>
            <Button
              mode="contained"
              color={loopDownActiveButton === 'pause' ? 'blue' : 'white'}
              style={styles.button}
              onPress={() => {
                pause('loop');
                setLoopDownActiveButton('pause');
              }}
            >
              ||
            </Button>
            <Button
              mode="contained"
              color={loopDownActiveButton === 'stop' ? 'red' : 'white'}
              style={styles.button}
              onPress={() => {
                stop('loop');
                setLoopDownActiveButton('stop');
              }}
            >
              []
            </Button>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (isEnum(Direction, newValue)) {
                  setLoopDownDirection(newValue);
                }
              }}
              value={loopDownDirection}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Backwards'}</Text>
                  <RadioButton value={Direction.Backwards} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Auto'}</Text>
                  <RadioButton value={Direction.Auto} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Forward'}</Text>
                  <RadioButton value={Direction.Forwards} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (isEnum(LoopMode, newValue)) {
                  setLoopDownLoop(newValue);
                }
              }}
              value={loopDownLoop}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Oneshot'}</Text>
                  <RadioButton value={LoopMode.OneShot} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Loop'}</Text>
                  <RadioButton value={LoopMode.Loop} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'PingPong'}</Text>
                  <RadioButton value={LoopMode.PingPong} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'None'}</Text>
                  <RadioButton value={LoopMode.None} />
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
              color={pingPongActiveButton === 'play' ? 'lightgreen' : 'white'}
              style={styles.button}
              onPress={() => {
                play('pingpong', pingPongLoop, pingPongDirection);
                setPingPongActiveButton('play');
              }}
            >
              {'>'}
            </Button>
            <Button
              mode="contained"
              color={pingPongActiveButton === 'pause' ? 'blue' : 'white'}
              style={styles.button}
              onPress={() => {
                pause('pingpong');
                setPingPongActiveButton('pause');
              }}
            >
              ||
            </Button>
            <Button
              mode="contained"
              color={pingPongActiveButton === 'stop' ? 'red' : 'white'}
              style={styles.button}
              onPress={() => {
                stop('pingpong');
                setPingPongActiveButton('stop');
              }}
            >
              []
            </Button>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (isEnum(Direction, newValue)) {
                  setPingPongDirection(newValue);
                }
              }}
              value={pingPongDirection}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Backwards'}</Text>
                  <RadioButton value={Direction.Backwards} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Auto'}</Text>
                  <RadioButton value={Direction.Auto} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Forward'}</Text>
                  <RadioButton value={Direction.Forwards} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={styles.buttonsRow}>
            <RadioButton.Group
              onValueChange={(newValue) => {
                if (isEnum(LoopMode, newValue)) {
                  setPingPongLoop(newValue);
                }
              }}
              value={pingPongLoop}
            >
              <View style={styles.radioButtonsWrapper}>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Oneshot'}</Text>
                  <RadioButton value={LoopMode.OneShot} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'Loop'}</Text>
                  <RadioButton value={LoopMode.Loop} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'PingPong'}</Text>
                  <RadioButton value={LoopMode.PingPong} />
                </View>
                <View style={styles.radioButtonWrapper}>
                  <Text>{'None'}</Text>
                  <RadioButton value={LoopMode.None} />
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
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  resetButton: {
    alignSelf: 'center',
    marginBottom: 16,
    maxWidth: 100,
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
