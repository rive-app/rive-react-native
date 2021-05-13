import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Rive, {
  RiveRef,
  Fit,
  Alignment,
  LoopMode,
  Direction,
} from 'rive-react-native';

export default function App() {
  const [isPlaying, setPlaying] = React.useState(false);
  const [fit, setFit] = React.useState(Fit.ScaleDown);
  const [alignment, setAlignment] = React.useState(Alignment.TopCenter);

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
          LoopMode.OneShot,
          Direction.Backwards
        );
    setPlaying((prev) => !prev);
  };

  const stopAnimation = () => {
    riveRef.current?.stop();
    setPlaying(false);
  };

  return (
    <View style={styles.container}>
      <Rive
        ref={riveRef}
        alignment={alignment}
        autoplay={false}
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
        style={styles.box}
        fit={fit}
        resourceName={
          Platform.OS === 'android' ? 'artboard_animations' : 'bird'
        }
        // url={'https://cdn.rive.app/animations/juice_v7.riv'}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={toggleAnimation}>
          <Text style={styles.button}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={playBothAnimations}>
          <Text style={styles.button}>
            {isPlaying ? 'PAUSE both' : 'PLAY both'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setFit((fitInner) =>
              fitInner === Fit.Contain ? Fit.ScaleDown : Fit.Contain
            )
          }
        >
          <Text>Change FIT</Text>
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
          <Text>Change Alignment</Text>
        </TouchableOpacity>
        {Platform.OS === 'android' ? (
          <TouchableOpacity onPress={stopAnimation}>
            <Text style={styles.button}>{'STOP'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
  },
  box: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
  button: {
    color: 'black',
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
    textAlign: 'center',
    padding: 5,
  },
});
