import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

export default function App() {
  const [isPlaying, setPlaying] = React.useState(true);

  const riveRef = React.useRef<RiveRef>(null);

  const toggleAnimation = () => {
    isPlaying ? riveRef.current?.pause() : riveRef.current?.play();
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
        onPlay={(animationName, isStateMachine) => {
          console.log('animation name :', animationName, isStateMachine);
        }}
        style={styles.box}
        resourceName={Platform.OS === 'android' ? 'flying_car' : 'bird'}
      />
      <View style={styles.wrapper}>
        <TouchableOpacity onPress={toggleAnimation}>
          <Text style={styles.button}>{isPlaying ? 'PAUSE' : 'PLAY'}</Text>
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
