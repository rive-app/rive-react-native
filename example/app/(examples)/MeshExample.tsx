import * as React from 'react';
import { Button, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Rive, { RiveRef } from 'rive-react-native';

const url =
  'https://public.uat.rive.app/community/runtime-files/148-325-tape.riv';

const STATE_MACHINE_NAME = 'State Machine 1';
export default function MeshExample() {
  const riveRef = React.useRef<RiveRef>(null);
  const [isHovered, setIsHovered] = React.useState(true);
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button
          title="Toggle Mesh State Machine"
          onPress={() => {
            setIsHovered(!isHovered);
            riveRef.current?.setInputState(
              STATE_MACHINE_NAME,
              'Hover',
              !isHovered
            );
          }}
        />
        <Rive
          ref={riveRef}
          url={url}
          style={styles.animation}
          autoplay={true}
          stateMachineName={STATE_MACHINE_NAME}
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
    marginBottom: 150,
  },
  animation: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
});
