import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Text,
} from 'react-native';
import Rive, { Fit, RiveOpenUrlEvent, RiveRef } from 'rive-react-native';

export default function Events() {
  const riveRef = useRef<RiveRef>(null);
  const [eventMessage, setEventMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={riveRef}
          autoplay={true}
          fit={Fit.Cover}
          style={styles.box}
          stateMachineName="State Machine 1"
          onRiveEventReceived={(event) => {
            const eventProperties = event.properties;
            if (eventProperties?.message) {
              setEventMessage(eventProperties.message as string);
            }
            if ('url' in event) {
              Linking.openURL((event as RiveOpenUrlEvent).url || '');
            }
          }}
          resourceName={'rating'}
        />
        <Text>{eventMessage}</Text>
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
  box: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
});
