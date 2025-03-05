import { useRef } from 'react';

import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Rive, {
  Alignment,
  Fit,
  RNRiveError,
  RNRiveErrorType,
  RiveRef,
} from 'rive-react-native';

export default function NestedDynamicText() {
  const riveRef = useRef<RiveRef>(null);

  const handleInputChange = (e: string) => {
    // Set the TextRun value of the 'name' TextRun
    // The name must exist else an error will be thrown
    // See: https://help.rive.app/runtimes/text
    riveRef.current?.setTextRunValue('Run A', e);
    // Set the TextRun value of the 'Run B' TextRun in nested Artboard 2.
    riveRef.current?.setTextRunValueAtPath('Run B', e, 'Artboard 2');
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView>
        <Rive
          ref={riveRef}
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          resourceName="hello_world_nested"
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.TextRunNotFoundError: {
                console.log(`${riveError.message}`);
                return;
              }
              default:
                console.log('Unhandled error');
                return;
            }
          }}
        />
        <TextInput
          onChangeText={handleInputChange}
          defaultValue=""
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
