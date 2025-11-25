import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import Rive, { Alignment, Fit } from 'rive-react-native';
import { isEnumKey } from '../../constants/typesPredicates';
import { Picker } from '@react-native-picker/picker';

const resourceName = 'truck_v7';

export default function Layout() {
  const [fit, setFit] = React.useState(Fit.Cover);
  const [alignment, setAlignment] = React.useState(Alignment.TopCenter);

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <Rive
        alignment={alignment}
        autoplay={true}
        style={styles.animation}
        fit={fit}
        resourceName={resourceName}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.pickersWrapper}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={fit}
              onValueChange={(value) => setFit(value)}
              mode={'dropdown'}
              style={styles.picker}
            >
              {Object.keys(Fit).map((key) =>
                isEnumKey(Fit, key) ? (
                  <Picker.Item key={key} value={Fit[key]} label={key} />
                ) : null
              )}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={alignment}
              onValueChange={(value) => setAlignment(value)}
              mode={'dropdown'}
              style={styles.picker}
            >
              {Object.keys(Alignment).map((key) =>
                isEnumKey(Alignment, key) ? (
                  <Picker.Item key={key} value={Alignment[key]} label={key} />
                ) : null
              )}
            </Picker>
          </View>
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
    justifyContent: 'flex-start',
  },
  animation: {
    width: '100%',
    height: 300,
  },
  picker: {
    flex: 1,
    width: '100%',
    color: 'black',
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
});
