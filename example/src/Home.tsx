import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

// @ts-ignore
export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Simple')}
          style={styles.buttonStyle}
        >
          Simple
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Http')}
          style={styles.buttonStyle}
        >
          HTTP
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Layout')}
          style={styles.buttonStyle}
        >
          Layout
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('StateMachine')}
          style={styles.buttonStyle}
        >
          State Machine
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('MultipleArtboards')}
          style={styles.buttonStyle}
        >
          Multiple Artboards
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LoopModeComponent')}
          style={styles.buttonStyle}
        >
          Loop Mode
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AndroidPlayer')}
          style={styles.buttonStyle}
        >
          Android Player
        </Button>
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
  buttonStyle: {
    marginBottom: 32,
  },
});
