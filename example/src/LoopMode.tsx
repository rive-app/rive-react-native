import * as React from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive, { Direction, Fit, LoopMode, RiveRef } from 'rive-react-native';
import { Button, RadioButton } from 'react-native-paper';
import { isEnum } from './typesPredicates';

const BUTTONS = ['stop', 'pause', 'play'] as const;
type ButtonKeys = (typeof BUTTONS)[number];

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

  const [rotateLoop, setRotateLoop] = useState(LoopMode.Auto);
  const [loopDownLoop, setLoopDownLoop] = useState(LoopMode.Auto);
  const [pingPongLoop, setPingPongLoop] = useState(LoopMode.Auto);

  const reset = () => {
    riveRef.current?.reset();
    setRotateActiveButton('stop');
    setLoopDownActiveButton('stop');
    setPingPongActiveButton('stop');
  };

  const play = (
    animationName: string,
    loop = LoopMode.Auto,
    direction = Direction.Auto
  ) => {
    riveRef.current?.play(animationName, loop, direction);
  };

  const pause = () => {
    riveRef.current?.pause();
  };

  const stop = () => {
    riveRef.current?.stop();
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Rive
        ref={riveRef}
        onPlay={(animationName, _) => {
          switch (animationName) {
            case 'oneshot':
              setRotateActiveButton('play');
              setLoopDownActiveButton('stop');
              setPingPongActiveButton('stop');
              break;
            case 'loop':
              setLoopDownActiveButton('play');
              setRotateActiveButton('stop');
              setPingPongActiveButton('stop');
              break;
            case 'pingpong':
              setPingPongActiveButton('play');
              setRotateActiveButton('stop');
              setLoopDownActiveButton('stop');
              break;
          }
        }}
        onPause={(animationName) => {
          switch (animationName) {
            case 'oneshot': {
              setRotateActiveButton('pause');
              setLoopDownActiveButton('stop');
              setPingPongActiveButton('stop');
              break;
            }
            case 'loop': {
              setLoopDownActiveButton('pause');
              setRotateActiveButton('stop');
              setPingPongActiveButton('stop');
              break;
            }

            case 'pingpong': {
              setPingPongActiveButton('pause');
              setLoopDownActiveButton('stop');
              setRotateActiveButton('stop');
              break;
            }
          }
        }}
        onStop={(animationName) => {
          console.log(animationName);
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
                pause();
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
                stop();
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
                  <Text>{'Auto'}</Text>
                  <RadioButton value={LoopMode.Auto} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>

        <View style={styles.controls}>
          <Text style={styles.animationName}>{'Animation: Bounce Y'}</Text>
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
                pause();
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
                stop();
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
                  <Text>{'Auto'}</Text>
                  <RadioButton value={LoopMode.Auto} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
        </View>

        <View style={styles.controls}>
          <Text style={styles.animationName}>{'Animation: Translate X'}</Text>
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
                pause();
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
                stop();
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
                  <Text>{'Auto'}</Text>
                  <RadioButton value={LoopMode.Auto} />
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
    height: 300,
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
