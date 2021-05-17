import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Rive, { Direction, Fit, RiveRef } from 'rive-react-native';
import { useState } from 'react';
import { Button, RadioButton } from 'react-native-paper';

export default function LoopModeComponent() {
  const riveRef = React.useRef<RiveRef>(null);
  const [direction, setDirection] = useState(Direction.Auto);

  const reset = () => {
    riveRef.current?.reset();
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          autoplay={true}
          fit={Fit.Contain}
          style={styles.animation}
          resourceName={'loopy'}
        />
        <View style={styles.row}>
          <Button mode={'contained'} onPress={reset}>
            Reset
          </Button>
          <RadioButton.Group
            // @ts-ignore
            onValueChange={(newValue) => setDirection(Direction[newValue])}
            value={direction}
          >
            <View style={styles.radioButtonsWrapper}>
              <View style={styles.radioButtonWrapper}>
                <Text>{'Backwards'}</Text>
                <RadioButton value={'Backwards'} />
              </View>
              <View style={styles.radioButtonWrapper}>
                <Text>{'Auto'}</Text>
                <RadioButton value={'Auto'} />
              </View>
              <View style={styles.radioButtonWrapper}>
                <Text>{'Forward'}</Text>
                <RadioButton value={'Forward'} />
              </View>
            </View>
          </RadioButton.Group>
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
    height: 300,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonsWrapper: {
    flexDirection: 'row',
  },
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
});
