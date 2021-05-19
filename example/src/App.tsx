import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import Layout from './Layout';
import Simple from './Simple';
import Http from './Http';
import StateMachine from './StateMachine';
import MultipleArtboards from './MultipleArtboards';
import LoopModeComponent from './LoopMode';
import StateTrigger from './StateTrigger';
import MultipleAnimations from './MultipleAnimations';
import SimpleControls from './SimpleControls';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Simple" component={Simple} />
        <Stack.Screen
          name="MultipleAnimations"
          component={MultipleAnimations}
        />
        <Stack.Screen name="SimpleControls" component={SimpleControls} />
        <Stack.Screen name="Layout" component={Layout} />
        <Stack.Screen name="Http" component={Http} />
        <Stack.Screen name="StateMachine" component={StateMachine} />
        <Stack.Screen name="MultipleArtboards" component={MultipleArtboards} />
        <Stack.Screen name="LoopModeComponent" component={LoopModeComponent} />
        <Stack.Screen name="StateTrigger" component={StateTrigger} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
