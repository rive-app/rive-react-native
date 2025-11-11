import { useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Rive, { Alignment, Fit, RiveRef } from 'rive-react-native';

export default function NestedInputs() {
  const riveRef = useRef<RiveRef>(null);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button
          onPress={async () => {
            const currentMyBoolean =
              await riveRef.current?.getBooleanStateAtPath(
                'myBoolean',
                'myNestedArtboard'
              );
            riveRef.current?.setInputStateAtPath(
              'myBoolean',
              !currentMyBoolean,
              'myNestedArtboard'
            );
          }}
        >
          Toggle myBoolean
        </Button>
        <Button
          onPress={() => {
            riveRef.current?.fireStateAtPath('myTrigger', 'myNestedArtboard');
          }}
        >
          Fire myTrigger
        </Button>
        <Button
          onPress={async () => {
            const currentNumber = (await riveRef.current?.getNumberStateAtPath(
              'myNumber',
              'myNestedArtboard'
            )) as number;
            const newNumber = (currentNumber % 3) + 1;

            riveRef.current?.setInputStateAtPath(
              'myNumber',
              newNumber,
              'myNestedArtboard'
            );
          }}
        >
          Add 1 to myNumber
        </Button>
        <Rive
          ref={riveRef}
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          artboardName="Main"
          stateMachineName="State Machine 1"
          autoplay={true}
          resourceName="runtime_nested_inputs"
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
    width: '100%',
    height: '50%',
  },
  animation: {
    width: '100%',
    height: '50%',
  },
});
