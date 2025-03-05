import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import Rive, { Fit } from 'rive-react-native';

export default function MultipleArtboards() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Avatar 1</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Avatar 1'}
          resourceName={'avatars'}
        />

        <Text>Avatar 2</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Avatar 2'}
          resourceName={'avatars'}
        />

        <Text>Avatar 3</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'Avatar 3'}
          resourceName={'avatars'}
        />

        <Text>All Avatars</Text>
        <Rive
          autoplay={true}
          style={styles.animation}
          fit={Fit.Contain}
          artboardName={'All Avatars'}
          resourceName={'avatars'}
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
    marginBottom: 150,
    paddingTop: 32,
  },
  animation: {
    width: '100%',
    height: 300,
    marginTop: 16,
    marginBottom: 32,
  },
});
