import { useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Rive, { Alignment, Fit, RiveRef } from 'rive-react-native';

export default function NestedInputs() {
  const riveRef = useRef<RiveRef>(null);
  const myBooleanRef = useRef(true);
  const myNumberRef = useRef(1);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button
          onPress={() => {
            riveRef.current?.setInputStateAtPath(
              'myBoolean',
              !myBooleanRef.current,
              'myNestedArtboard'
            );

            myBooleanRef.current = !myBooleanRef.current;
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
          onPress={() => {
            const newNumber = (myNumberRef.current % 3) + 1;

            riveRef.current?.setInputStateAtPath(
              'myNumber',
              newNumber,
              'myNestedArtboard'
            );

            myNumberRef.current = newNumber;
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
          resourceName="nested_inputs"
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
