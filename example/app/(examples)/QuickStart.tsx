/*
  Resource:

  - Getting Started with Rive + React Native: https://rive.app/docs/runtimes/react-native/react-native
  - Data Binding: https://rive.app/docs/runtimes/data-binding
  - Setting and reading view model properties: https://rive.app/docs/runtimes/data-binding#observability
*/

import { useEffect } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Rive, {
  useRive,
  Fit,
  AutoBind,
  useRiveNumber,
  useRiveTrigger,
  RNRiveError,
  RNRiveErrorType,
} from 'rive-react-native';

export default function QuickStart() {
  const [setRiveRef, riveRef] = useRive();

  // This is how your read and set properties from your Rive View Model
  const [health, setHealth] = useRiveNumber(riveRef, 'health');

  // Reference a Trigger from your View Model
  const gameOverTrigger = useRiveTrigger(riveRef, 'gameOver', () => {
    // Listen for a Trigger event, whether it comes from the Rive app or from the code
    console.log('Game Over Triggered');
  });

  useEffect(() => {
    if (riveRef && setHealth) {
      // Set the initial health value
      setHealth(9);
    }
  }, [riveRef, setHealth]);

  const handleTakeDamage = () => {
    if (health && setHealth) {
      setHealth(health - 7);
      // In case the State Machine pauses due to inactivity
      riveRef?.play();
    }
  };

  const handleMaxHealth = () => {
    if (setHealth) {
      setHealth(100);
      riveRef?.play();
    }
  };

  const handleGameOver = () => {
    if (setHealth && gameOverTrigger) {
      setHealth(0);
      gameOverTrigger();
      riveRef?.play();
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={setRiveRef}
          // This is expecting a resource named quick_start.riv
          // For iOS, make sure it's listed in XCode under "Build Phases > Copy Bundle Resources"
          // For Android, make sure it's in the /android/app/src/main/res/raw/ directory
          resourceName={'quick_start'}
          // You can also load an external .riv file
          // url={'https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv'}
          fit={Fit.Layout}
          style={styles.animation}
          autoplay={true}
          // AutoBind uses the view model instance from your Rive file
          dataBinding={AutoBind(true)}
          // dataBinding={BindByIndex(0)}
          // dataBinding={BindByName('SomeName')}
          // dataBinding={BindEmpty()}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.DataBindingError: {
                console.error(`${riveError.message}`);
                return;
              }
              default:
                console.error('Unhandled error');
                return;
            }
          }}
        />
      </ScrollView>
      <Button onPress={handleTakeDamage} title="Take Damage" />
      <Button onPress={handleMaxHealth} title="Max Health" />
      <Button onPress={handleGameOver} title="Game Over" />
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
  },
});
