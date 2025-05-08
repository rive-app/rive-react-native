import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  Text,
  Modal,
} from 'react-native';
import Rive, {
  AutoBind,
  // BindByIndex,
  // BindByName,
  // BindEmpty,
  Fit,
  RNRiveError,
  RNRiveErrorType,
  useRive,
  useRiveColor,
  useRiveNumber,
  useRiveString,
} from 'rive-react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

export default function DataBinding() {
  // RIVE HOOKS
  const [setRiveRef, riveRef] = useRive();
  let [buttonText, setButtonText] = useRiveString(riveRef, 'Button/State_1');
  let [lives, setLives] = useRiveNumber(riveRef, 'Energy_Bar/Lives');
  let [barColor, setBarColor] = useRiveColor(riveRef, 'Energy_Bar/Bar_Color');
  let [price, setPrice] = useRiveNumber(riveRef, 'Price_Value');
  let [coinValue] = useRiveNumber(riveRef, 'Coin/Item_Value');

  useEffect(() => {
    if (coinValue !== undefined) {
      console.log('coinValue changed:', coinValue);
    }
  }, [coinValue]);

  // MODAL CONTROLS
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const [livesInput, setLivesInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [previewColor, setPreviewColor] = useState({
    r: 0,
    g: 255,
    b: 0,
    a: 255,
  });
  const [sliderValues, setSliderValues] = useState({
    r: 0,
    g: 255,
    b: 0,
    a: 255,
  });
  const [textInput, setTextInput] = useState('');

  // INITIAL VALUES SET
  const initialValuesSet = useRef(false);

  useEffect(() => {
    if (!initialValuesSet.current && buttonText && lives && barColor && price) {
      setTextInput(buttonText);
      setLivesInput(lives.toString());
      setPriceInput(price.toString());
      setPreviewColor(barColor);
      setSliderValues(barColor);
      initialValuesSet.current = true;
    }
  }, [buttonText, lives, barColor, price]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <Button
          mode="text"
          onPress={() => setIsOpen(!isOpen)}
          style={styles.headerButton}
        >
          Controls
        </Button>
      ),
    });
  }, [navigation, isOpen]);

  const handleTextChange = (text: string) => {
    setTextInput(text);
  };

  const handleTextBlur = () => {
    setButtonText(textInput);
  };

  const handleLivesChange = (text: string) => {
    setLivesInput(text);
    const value = parseInt(text, 10);
    if (!isNaN(value) && value >= 0 && value <= 9) {
      setLives(value);
    }
  };

  const handleLivesBlur = () => {
    const value = parseInt(livesInput, 10);
    if (!isNaN(value) && value >= 0 && value <= 9) {
      setLives(value);
    } else {
      setLives(3);
      setLivesInput('3');
    }
  };

  const handlePriceChange = (text: string) => {
    setPriceInput(text);
    const value = parseFloat(text);
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
    }
  };

  const handlePriceBlur = () => {
    const value = parseFloat(priceInput);
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
    } else {
      setPrice(0);
      setPriceInput('0');
    }
  };

  const handleSliderChange = useCallback(
    (component: 'r' | 'g' | 'b' | 'a', value: number) => {
      const newColor = {
        ...previewColor,
        [component]: value,
      };
      setPreviewColor(newColor);
      setBarColor(newColor);
    },
    [previewColor, setBarColor]
  );

  const handleSliderComplete = useCallback(
    (component: 'r' | 'g' | 'b' | 'a', value: number) => {
      const newColor = {
        ...previewColor,
        [component]: value,
      };
      setPreviewColor(newColor);
      setSliderValues((prev) => ({
        ...prev,
        [component]: value,
      }));
    },
    [previewColor]
  );

  return (
    <SafeAreaView style={styles.safeAreaViewContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Rive
          ref={setRiveRef}
          fit={Fit.Layout}
          style={styles.animation}
          layoutScaleFactor={1}
          autoplay={true}
          dataBinding={AutoBind(true)}
          // dataBinding={BindByIndex(0)}
          // dataBinding={BindByName('SomeName')}
          // dataBinding={BindEmpty()}
          stateMachineName={'State Machine 1'}
          resourceName={'rewards'}
          onError={(riveError: RNRiveError) => {
            switch (riveError.type) {
              case RNRiveErrorType.DataBindingError: {
                console.error(`${riveError.message}`);
                return;
              }
              default:
                console.error('Unhandled error');
                return;
            }
          }}
        />
      </ScrollView>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Controls</Text>
              <Button onPress={() => setIsOpen(false)}>Close</Button>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Button Text</Text>
              <TextInput
                style={styles.input}
                value={textInput}
                onChangeText={handleTextChange}
                onBlur={handleTextBlur}
                placeholder="Enter button text"
              />

              <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Text style={styles.label}>Lives (0-9)</Text>
                  <TextInput
                    style={styles.input}
                    value={livesInput}
                    onChangeText={handleLivesChange}
                    onBlur={handleLivesBlur}
                    keyboardType="number-pad"
                    maxLength={1}
                    placeholder="Enter number of lives"
                  />
                </View>

                <View style={styles.columnContainer}>
                  <Text style={styles.label}>Price</Text>
                  <TextInput
                    style={styles.input}
                    value={priceInput}
                    onChangeText={handlePriceChange}
                    onBlur={handlePriceBlur}
                    keyboardType="decimal-pad"
                    placeholder="Enter price"
                  />
                </View>
              </View>

              <Text style={styles.label}>Bar Color</Text>
              <View style={styles.colorPickerContainer}>
                <View
                  style={[
                    styles.colorPreview,
                    {
                      backgroundColor: `rgba(${previewColor.r}, ${previewColor.g}, ${previewColor.b}, ${previewColor.a / 255})`,
                    },
                  ]}
                />
                <Text style={styles.colorValue}>
                  RGBA: {Math.round(previewColor.r)},{' '}
                  {Math.round(previewColor.g)}, {Math.round(previewColor.b)},{' '}
                  {Math.round((previewColor.a / 255) * 100)}%
                </Text>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Red</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={sliderValues.r}
                    onValueChange={(value) => handleSliderChange('r', value)}
                    onSlidingComplete={(value) =>
                      handleSliderComplete('r', value)
                    }
                    minimumTrackTintColor="#FF0000"
                    maximumTrackTintColor="#FF0000"
                  />
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Green</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={sliderValues.g}
                    onValueChange={(value) => handleSliderChange('g', value)}
                    onSlidingComplete={(value) =>
                      handleSliderComplete('g', value)
                    }
                    minimumTrackTintColor="#00FF00"
                    maximumTrackTintColor="#00FF00"
                  />
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Blue</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={sliderValues.b}
                    onValueChange={(value) => handleSliderChange('b', value)}
                    onSlidingComplete={(value) =>
                      handleSliderComplete('b', value)
                    }
                    minimumTrackTintColor="#0000FF"
                    maximumTrackTintColor="#0000FF"
                  />
                </View>

                <View style={styles.sliderContainer}>
                  <Text style={styles.sliderLabel}>Alpha</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={255}
                    value={sliderValues.a}
                    onValueChange={(value) => handleSliderChange('a', value)}
                    onSlidingComplete={(value) =>
                      handleSliderComplete('a', value)
                    }
                    minimumTrackTintColor="#808080"
                    maximumTrackTintColor="#808080"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerButton: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  colorPickerContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  colorValue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  columnContainer: {
    flex: 1,
  },
});
