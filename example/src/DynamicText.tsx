import * as React from 'react';
import { useRef } from 'react';

import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Rive, { Alignment, Fit, RiveRef } from 'rive-react-native';

export default function DynamicText() {
  const riveRef = useRef<RiveRef>(null);

  const handleInputChange = (e: string) => {
    // Set the TextRun value of the 'name' TextRun
    riveRef.current?.setTextRunValue('name', e);
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView>
        <Rive
          ref={riveRef}
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          resourceName="hello_world_text"
        />
        <TextInput
          onChangeText={handleInputChange}
          defaultValue="world"
          style={styles.input}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  animation: {
    width: '100%',
    height: 100,
  },
});
