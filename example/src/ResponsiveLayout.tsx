import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Button, Text } from 'react-native';
import Rive, { Fit } from 'rive-react-native';

// const resourceName = 'layouts_demo';
const resourceName = 'layout_test';

export default function ResponsiveLayout() {
  const [scaleFactor, setScaleFactor] = React.useState(4.0);

  const increaseScale = () => setScaleFactor((prev) => prev + 0.5);
  const decreaseScale = () =>
    setScaleFactor((prev) => Math.max(0.5, prev - 0.5));

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Rive
        autoplay={true}
        style={styles.animation}
        fit={Fit.Layout}
        layoutScaleFactor={scaleFactor} // If you do not set this, Rive will automatically scale the layout to match the device pixel ratio
        resourceName={resourceName}
      />
      <View style={styles.controls}>
        <Text style={styles.label}>Layout Scale Factor</Text>
        <View style={styles.scaleControls}>
          <Button title="-" onPress={decreaseScale} />
          <View style={styles.scaleText}>
            <Text>{scaleFactor.toFixed(1)}x</Text>
          </View>
          <Button title="+" onPress={increaseScale} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewContainer: {
    flex: 1,
  },
  animation: {
    width: '100%',
    flex: 1,
  },
  controls: {
    padding: 16,
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    width: '100%',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
    margin: 16,
  },
  pickersWrapper: {
    flex: 1,
    padding: 16,
    alignSelf: 'stretch',
  },
  scaleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    gap: 16,
  },
  scaleText: {
    minWidth: 50,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
});
