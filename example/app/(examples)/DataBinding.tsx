import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Button,
  View,
} from 'react-native';
import Rive, { Fit, RiveRef } from 'rive-react-native';

export default function DataBinding() {
  const riveRef = React.useRef<RiveRef>(null);

  const updateDataBindingValues = () => {
    // Update the view model instance properties
    // NUMBER VALUE
    riveRef.current?.setNumberPropertyValue('Energy_Bar/Lives', 7);
    // STRING VALUE
    riveRef.current?.setStringPropertyValue('Button/State_1', "Let's go!");
    // COLOR VALUE
    riveRef.current?.setColorPropertyValue('Energy_Bar/Bar_Color', {
      r: 0,
      g: 255,
      b: 0,
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
