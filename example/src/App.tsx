import React, { useEffect } from 'react';
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
import SimpleControls from './SimpleControls';
import ErrorNotHandled from './ErrorNotHandled';
import ErrorHandledManually from './ErrorHandledManually';
import MeshExample from './MeshExample';
import DynamicText from './DynamicText';
import NestedInputs from './NestedInputs';
import Events from './Events';

import {
  RiveRenderer,
  RiveRendererAndroid,
  RiveRendererIOS,
} from 'rive-react-native';

const Stack = createStackNavigator();

export default function Main() {
  // Configure the defualt renderer to use for both iOS and Android.
  // For more information: https://rive.app/community/doc/overview/docD20dU9Rod
  //
  // This is optional. The current defaults are:
  // - iOS: Rive
  // - Android: Skia
  // In the future the default will be the Rive Renderer (RiveRendererIOS.Rive and RiveRendererAndroid.Rive)
  //
  useEffect(() => {
    RiveRenderer.defaultRenderer(
      RiveRendererIOS.Rive,
      RiveRendererAndroid.Skia
    );
  }, []);

  return <App />;
}

function App() {
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
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="NestedInputs" component={NestedInputs} />
          <Stack.Screen name="DynamicText" component={DynamicText} />
          <Stack.Screen
            name="MultipleArtboards"
            component={MultipleArtboards}
          />
          <Stack.Screen
            name="LoopModeComponent"
            component={LoopModeComponent}
          />
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
