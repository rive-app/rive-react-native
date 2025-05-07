import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Button,
  View,
} from 'react-native';
import Rive, {
  AutoBind,
  BindByIndex,
  BindByName,
  BindEmpty,
  Fit,
  useRive,
  useRiveColor,
  useRiveNumber,
  useRiveString,
} from 'rive-react-native';

export default function DataBinding() {
  const [setRiveRef, riveRef] = useRive();
  const [showRive, setShowRive] = useState(false);

  let [buttonText, setButtonText] = useRiveString(riveRef, 'Button/State_1');
  let [lives, setLives] = useRiveNumber(riveRef, 'Energy_Bar/Lives');
  let [barColor, setBarColor] = useRiveColor(riveRef, 'Energy_Bar/Bar_Color');

  useEffect(() => {
    if (riveRef) {
      setButtonText('Hello 123!');
      setLives(3);
      setBarColor({ r: 0, g: 255, b: 0, a: 255 });
      // setBarColor('#00FF00FF'); // Example of using hex color
    }
  }, [riveRef, setBarColor, setButtonText, setLives]);

  // Used for testing that the Rive instance is mounted
  // and the properties listeners are being updated correctly
  useEffect(() => {
    setTimeout(() => setShowRive(true), 1000); // Delay mounting <Rive />
  }, []);

  console.log('Button Text:', buttonText);
  console.log('Lives:', lives);
  console.log('Bar Color:', barColor);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {showRive && (
          <Rive
            ref={setRiveRef}
            fit={Fit.Layout}
            style={styles.animation}
            layoutScaleFactor={1}
            autoplay={true}
            dataBinding={AutoBind(true)}
            // dataBinding={BindByIndex(0)}
            // dataBinding={BindByName('SomeName')}
            // dataBinding={BindEmpty()}
            stateMachineName={'State Machine 1'}
            resourceName={'rewards'}
          />
        )}
        <View style={styles.buttonContainer}>
          <Button
            title="Update data"
            onPress={() => {
              riveRef?.setString('Button/State_1', 'Hello!');
              riveRef?.setNumber('Energy_Bar/Lives', 3);
              riveRef?.setColor('Energy_Bar/Bar_Color', {
                r: 255,
                g: 0,
                b: 0,
                a: 255,
              });
            }}
          />
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
  },
  animation: {
    width: '100%',
    height: 300,
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
});
