import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';
import { Button } from 'react-native-paper';

export default function SimpleControls() {
  const autoplay = false;
  const [isPlaying, setPlaying] = React.useState(autoplay);

  const riveRef = React.useRef<RiveRef>(null);

  const toggleAnimation = () => {
    isPlaying ? riveRef.current?.pause() : riveRef.current?.play();
    setPlaying((prev) => !prev);
  };

  const stopAnimation = () => {
    riveRef.current?.stop();
    setPlaying(false);
  };

  const resetAnimation = () => {
    riveRef.current?.reset();
    setPlaying(autoplay);
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          style={styles.animation}
          autoplay={autoplay}
          resourceName={'flying_car'}
        />
        <View style={styles.row}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={toggleAnimation}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={stopAnimation}
          >
            {'Stop'}
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={resetAnimation}
          >
            {'Reset'}
          </Button>
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
    height: 500,
    marginVertical: 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    marginRight: 8,
  },
});
