import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import Rive, {
  Alignment,
  Fit,
  RNRiveError,
  RNRiveErrorType,
} from 'rive-react-native';

export default function ErrorHandledManually() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Testing Issue #327 Fix</Text>
        <Text style={styles.description}>
          Testing the URL that was causing MalformedFileException crashes
        </Text>
        
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          animationName="exampleName"
          url={
            'https://cdn.jsdelivr.net/gh/shubham-k2/assets@main/Updated%20surprise_sale_banner.riv'
          }
          onError={(riveError: RNRiveError) => {
            console.log('📱 Rive Error Received:', riveError);
            switch (riveError.type) {
              case RNRiveErrorType.IncorrectRiveFileUrl: {
                console.log(`❌ URL Error: ${riveError.message}`);
                return;
              }
              case RNRiveErrorType.MalformedFile: {
                console.log(`❌ Malformed File: ${riveError.message}`);
                return;
              }
              case RNRiveErrorType.FileNotFound: {
                console.log(`❌ File not found: ${riveError.message}`);
                return;
              }
              case RNRiveErrorType.IncorrectArtboardName: {
                console.log(`❌ Incorrect Artboard: ${riveError.message}`);
                return;
              }
              case RNRiveErrorType.UnsupportedRuntimeVersion: {
                console.log(`❌ Runtime version unsupported: ${riveError.message}`);
                return;
              }
              case RNRiveErrorType.IncorrectStateMachineName: {
                console.log(`❌ State Machine Error: ${riveError.message}`);
                return;
              }
              case RNRiveErrorType.IncorrectStateMachineInput: {
                console.log(`❌ State Machine Input Error: ${riveError.message}`);
                return;
              }
              default:
                console.log(`❌ Unknown Error: ${riveError.message}`);
                return;
            }
          }}
        />
        
        <Text style={styles.subtitle}>Testing Working URL</Text>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          url={'https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv'}
          onError={(riveError: RNRiveError) => {
            console.log('📱 Working URL Error (unexpected):', riveError);
          }}
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});
