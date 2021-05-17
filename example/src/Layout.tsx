import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import Rive, { Alignment, Fit } from 'rive-react-native';
import { Picker } from '@react-native-picker/picker';

export default function Layout() {
  const [fit, setFit] = React.useState(Fit.Cover);
  const [alignment, setAlignment] = React.useState(Alignment.TopCenter);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Picker
            selectedValue={fit}
            onValueChange={(value) => setFit(value)}
            mode={'dropdown'}
            style={styles.picker}
          >
            {Object.keys(Fit).map((key) => (
              // @ts-ignore
              <Picker.Item key={key} value={Fit[key]} label={key} />
            ))}
          </Picker>
          <Picker
            selectedValue={alignment}
            onValueChange={(value) => setAlignment(value)}
            mode={'dropdown'}
            style={styles.picker}
          >
            {Object.keys(Alignment).map((key) => (
              // @ts-ignore
              <Picker.Item key={key} value={Alignment[key]} label={key} />
            ))}
          </Picker>
        </View>
        <View style={styles.animationWrapper}>
          <Rive
            alignment={alignment}
            autoplay={true}
            style={styles.animation}
            fit={fit}
            resourceName={'flying_car'}
          />
        </View>
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
    height: 300,
  },
  animationWrapper: {
    width: '100%',
    height: 500,
    marginVertical: 20,
  },
  picker: {
    height: 50,
    width: '50%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
});
