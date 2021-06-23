import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Rive from 'rive-react-native';

const url = 'https://cdn.rive.app/animations/juice_v7.riv';
// const url =
//   'https://drive.google.com/uc?export=download&id=1SNX_aDqW7tVxm4ZArOtE7F5zupcejrls';
// const url = 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg';
export default function Http() {
  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          url={url}
          style={styles.animation}
          onError={() => {
            console.log('test');
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
    marginBottom: 150,
  },
  animation: {
    width: '100%',
    height: 400,
    marginVertical: 20,
  },
});
