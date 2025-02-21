import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Rive, { RiveRef } from 'rive-react-native';
import React from 'react';

function RiveDemo() {
  return (
    <Rive
      url="https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv"
      artboardName="Avatar 1"
      stateMachineName="avatar"
      style={{ width: 400, height: 400 }}
    />
  );
}

export default function HomeScreen() {
  // const riveRef = React.useRef<RiveRef>(null);
  // React.useRef(null);

  // const handlePlay = () => {
  //   riveRef.current?.play();
  // };

  return <RiveDemo />;

}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
