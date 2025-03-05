import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
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
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          animationName="exampleName"
          url={'wrongUrl'}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.IncorrectRiveFileUrl: {
                console.log(`${riveError.message}`);
                return;
              }
              case RNRiveErrorType.MalformedFile: {
                console.log('Malformed File');
                return;
              }
              case RNRiveErrorType.FileNotFound: {
                console.log('File not found');
                return;
              }
              case RNRiveErrorType.IncorrectArtboardName: {
                console.log('IncorrectAnimationName');
                return;
              }
              case RNRiveErrorType.UnsupportedRuntimeVersion: {
                console.log('Runtime version unsupported');
                return;
              }
              case RNRiveErrorType.IncorrectStateMachineName: {
                console.log(`${riveError.message}`);
                return;
              }
              case RNRiveErrorType.IncorrectStateMachineInput: {
                console.log(`${riveError.message}`);
                return;
              }
              default:
                return;
            }
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: 600,
  },
});
