/*
  Rive React Native Scripting Example

  Resources:
  - Rive Scripting: https://rive.app/docs/scripting
*/

import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, { Alignment, AutoBind, Fit } from 'rive-react-native';

export default function DemoScripting() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          autoplay={true}
          dataBinding={AutoBind(true)}
          source={require('../../assets/rive/blinko.riv')}
        />
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
});
