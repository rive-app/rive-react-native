import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';

// @ts-ignore // Doesn't matter for the example
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
          onPress={() => navigation.navigate('MeshExample')}
          style={styles.buttonStyle}
        >
          Mesh Example
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
          onPress={() => navigation.navigate('ResponsiveLayout')}
          style={styles.buttonStyle}
        >
          Responsive Layout
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('SimpleControls')}
          style={styles.buttonStyle}
        >
          Simple Controls
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
          onPress={() => navigation.navigate('MultipleArtboards')}
          style={styles.buttonStyle}
        >
          Multiple Artboards
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
          onPress={() => navigation.navigate('Events')}
          style={styles.buttonStyle}
        >
          Events
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('NestedInputs')}
          style={styles.buttonStyle}
        >
          Nested Inputs
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('DynamicText')}
          style={styles.buttonStyle}
        >
          Dynamic Text
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('ErrorNotHandled')}
          style={styles.buttonStyle}
        >
          Error not Handled
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('ErrorHandledManually')}
          style={styles.buttonStyle}
        >
          Error Handled Manually
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
    padding: 16,
  },
  buttonStyle: {
    marginBottom: 16,
    minWidth: 300,
  },
});
