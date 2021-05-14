import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Rive, {
  RiveRef,
  Fit,
  Alignment,
  LoopMode,
  Direction,
} from 'rive-react-native';

export default function MultipleAnimations() {
  const autoplay = false;
  const [isPlaying, setPlaying] = React.useState(autoplay);
  const [fit, setFit] = React.useState(Fit.Cover);
  const [alignment, setAlignment] = React.useState(Alignment.TopCenter);
  const [artboardName, setArtboardName] = React.useState('Square');

  const riveRef = React.useRef<RiveRef>(null);

  const toggleAnimation = () => {
    isPlaying ? riveRef.current?.pause() : riveRef.current?.play();
    setPlaying((prev) => !prev);
  };

  const playBothAnimations = () => {
    isPlaying
      ? riveRef.current?.pause(['rollaround', 'goaround'])
      : riveRef.current?.play(
          ['rollaround', 'goaround'],
          LoopMode.Loop,
          Direction.Forwards
        );
    setPlaying((prev) => !prev);
  };

  const stopAnimation = () => {
    riveRef.current?.stop();
    setPlaying(false);
  };

  const stopBothAnimations = () => {
    riveRef.current?.stop(['rollaround', 'goaround']);
    setPlaying(false);
  };

  const resetAnimation = () => {
    riveRef.current?.reset();
    setPlaying(autoplay);
  };

  const changeArtboard = () => {
    setArtboardName((prevArtboardName) =>
      prevArtboardName === 'Square' ? 'Circle' : 'Square'
    );
    setPlaying(autoplay);
  };

  return (
    <>
      <Rive
        ref={riveRef}
        alignment={alignment}
        autoplay={autoplay}
        artboardName={artboardName}
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
        fit={fit}
        resourceName={'artboard_animations'}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.button} onPress={toggleAnimation}>
          <Text style={styles.buttonText}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetAnimation}>
          <Text style={styles.buttonText}>{'RESET'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={changeArtboard}>
          <Text style={styles.buttonText}>
            Change artboardName to{' '}
            {artboardName === 'Square' ? 'Circle' : 'Square'}
          </Text>
        </TouchableOpacity>

        {artboardName === 'Square' && (
          <TouchableOpacity style={styles.button} onPress={playBothAnimations}>
            <Text style={styles.buttonText}>
              {isPlaying ? 'PAUSE both' : 'PLAY both'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFit((fitInner) =>
              fitInner === Fit.Cover ? Fit.ScaleDown : Fit.Cover
            )
          }
        >
          <Text style={styles.buttonText}>{'CHANGE FIT'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setAlignment((fitInner) =>
              fitInner === Alignment.TopCenter
                ? Alignment.BottomCenter
                : Alignment.TopCenter
            )
          }
        >
          <Text style={styles.buttonText}>{'CHANGE ALIGNMENT'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={stopAnimation}>
          <Text style={styles.buttonText}>{'STOP'}</Text>
        </TouchableOpacity>

        {artboardName === 'Square' && (
          <TouchableOpacity style={styles.button} onPress={stopBothAnimations}>
            <Text style={styles.buttonText}>{'STOP both'}</Text>
          </TouchableOpacity>
        )}
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
