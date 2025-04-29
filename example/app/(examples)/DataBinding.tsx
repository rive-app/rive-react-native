import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Button,
  View,
} from 'react-native';
import Rive, {
  Fit,
  RiveRef,
  useRiveColor,
  useRiveNumber,
  useRiveReady,
  useRiveString,
} from 'rive-react-native';

export default function DataBinding() {
  const riveRef = React.useRef<RiveRef>(null);
  const riveIsReady = useRiveReady(riveRef);

  let [buttonText, setButtonText] = useRiveString(riveRef, 'Button/State_1');
  let [lives, setLives] = useRiveNumber(riveRef, 'Energy_Bar/Lives');
  let [barColor, setBarColor] = useRiveColor(riveRef, 'Energy_Bar/Bar_Color');

  useEffect(() => {
    if (riveIsReady) {
      // Set initial values through hooks
      setButtonText("Let's go!");
      setLives(7);
      setBarColor({ r: 0, g: 255, b: 0, a: 255 });
    }
  }, [riveIsReady, setButtonText, setLives, setBarColor]);

  console.log('Button Text:', buttonText);
  console.log('Lives:', lives);
  console.log('Bar Color:', barColor);

  // Set values directly
  const updateDataBindingValues = () => {
    // SET NUMBER VALUE
    riveRef.current?.setNumber('Energy_Bar/Lives', 6);
    // SET STRING VALUE
    riveRef.current?.setString('Button/State_1', 'Direct!');
    // SET COLOR VALUE
    riveRef.current?.setColor('Energy_Bar/Bar_Color', {
      r: 0,
      g: 0,
      b: 255,
      a: 255,
    });
    // Or set the color using a hex string
    // riveRef.current?.setColorPropertyValue('Energy_Bar/Bar_Color', '#0000FFFF');
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          fit={Fit.Layout}
          style={styles.animation}
          layoutScaleFactor={1}
          autoplay={true}
          stateMachineName={'State Machine 1'}
          resourceName={'rewards'}
        />
        <View style={styles.buttonContainer}>
          <Button title="Update data" onPress={updateDataBindingValues} />
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
