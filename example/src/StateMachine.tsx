import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';
import { RadioButton } from 'react-native-paper';
import { useState } from 'react';

export default function StateMachine() {
  const riveRef = React.useRef<RiveRef>(null);
  const [selectedLevel, setSelectedLevel] = useState('2');

  const setLevel = (n: number) => {
    setSelectedLevel(n.toString());
    riveRef.current?.setInputState("Designer's Test", 'Level', n);
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          autoplay={true}
          fit={Fit.Cover}
          style={styles.box}
          stateMachineName="Designer's Test"
          onStateChanged={(stateName) => {
            console.log('onStateChanged: ', stateName);
          }}
          resourceName={'skills'}
        />
        <RadioButton.Group
          onValueChange={(newValue) => setLevel(parseInt(newValue, 10))}
          value={selectedLevel}
        >
          <View style={styles.radioButtonsWrapper}>
            <View style={styles.radioButtonWrapper}>
              <Text>{'Beginner'}</Text>
              <RadioButton value={'0'} />
            </View>
            <View style={styles.radioButtonWrapper}>
              <Text>{'Intermediate'}</Text>
              <RadioButton value={'1'} />
            </View>
            <View style={styles.radioButtonWrapper}>
              <Text>{'Expert'}</Text>
              <RadioButton value={'2'} />
            </View>
          </View>
        </RadioButton.Group>
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
  picker: {
    width: '100%',
    height: 50,
  },
  radioButtonsWrapper: {
    flexDirection: 'row',
  },
  radioButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
});
