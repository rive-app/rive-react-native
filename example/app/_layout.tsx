import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on other pages keeps a back button present.
  initialRouteName: '/',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Example App' }} />

          <Stack.Screen
            name="(examples)/Simple"
            options={{ title: 'Simple' }}
          />
          <Stack.Screen
            name="(examples)/SimpleControls"
            options={{ title: 'Simple Controls' }}
          />
          <Stack.Screen
            name="(examples)/Layout"
            options={{ title: 'Layout' }}
          />
          <Stack.Screen
            name="(examples)/ResponsiveLayout"
            options={{ title: 'Responsive Layout' }}
          />
          <Stack.Screen name="(examples)/Http" options={{ title: 'HTTP' }} />
          <Stack.Screen
            name="(examples)/MeshExample"
            options={{ title: 'Mesh Example' }}
          />
          <Stack.Screen
            name="(examples)/StateMachine"
            options={{ title: 'State Machine' }}
          />
          <Stack.Screen
            name="(examples)/Events"
            options={{ title: 'Events' }}
          />
          <Stack.Screen
            name="(examples)/DynamicText"
            options={{ title: 'Dynamic Text' }}
          />
          <Stack.Screen
            name="(examples)/OutOfBandAssets"
            options={{ title: 'Out Of Band Assets' }}
          />
          <Stack.Screen
            name="(examples)/NestedDynamicText"
            options={{ title: 'Nested Dynamic Text' }}
          />
          <Stack.Screen
            name="(examples)/MultipleArtboards"
            options={{ title: 'Multiple Artboards' }}
          />
          <Stack.Screen
            name="(examples)/ErrorNotHandled"
            options={{ title: 'Error Not Handled' }}
          />
          <Stack.Screen
            name="(examples)/ErrorHandledManually"
            options={{ title: 'Error Handled Manually' }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
