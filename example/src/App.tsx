import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './Home';
import Layout from './Layout';
import Simple from './Simple';
import Http from './Http';
import StateMachine from './StateMachine';
import MultipleArtboards from './MultipleArtboards';
import LoopModeComponent from './LoopMode';
import StateTrigger from './StateTrigger';
import SimpleControls from './SimpleControls';
import ErrorNotHandled from './ErrorNotHandled';
import ErrorHandledManually from './ErrorHandledManually';
import MeshExample from './MeshExample';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Example App' }}
          />
          <Stack.Screen name="Simple" component={Simple} />
          <Stack.Screen name="SimpleControls" component={SimpleControls} />
          <Stack.Screen name="Layout" component={Layout} />
          <Stack.Screen name="Http" component={Http} />
          <Stack.Screen name="MeshExample" component={MeshExample} />
          <Stack.Screen name="StateMachine" component={StateMachine} />
          <Stack.Screen
            name="MultipleArtboards"
            component={MultipleArtboards}
          />
          <Stack.Screen
            name="LoopModeComponent"
            component={LoopModeComponent}
          />
          <Stack.Screen name="StateTrigger" component={StateTrigger} />
          <Stack.Screen name="ErrorNotHandled" component={ErrorNotHandled} />
          <Stack.Screen
            name="ErrorHandledManually"
            component={ErrorHandledManually}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
