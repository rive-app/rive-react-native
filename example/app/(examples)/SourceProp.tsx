import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import Rive, { Alignment, Fit } from 'rive-react-native';

export default function SourceProp() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Require</Text>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          artboardName={'Avatar 3'}
          autoplay={true}
          source={require('../../assets/rive/avatars.riv')}
        />
        <Text>HTTP URI</Text>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          artboardName={'Avatar 3'}
          autoplay={true}
          source={{
            uri: 'https://public.rive.app/community/runtime-files/2195-4346-avatar-pack-use-case.riv',
          }}
        />
        <Text>Resource name URI</Text>
        <Rive
          fit={Fit.Contain}
          alignment={Alignment.Center}
          style={styles.animation}
          artboardName={'Avatar 3'}
          autoplay={true}
          source={{
            uri: 'avatars',
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
    height: 300,
  },
});
