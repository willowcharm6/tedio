import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const valuesList = [
  'Respect', 'Honesty', 'Responsibility', 'Empathy', 'Courage',
  'Perseverance', 'Gratitude', 'Curiosity', 'Kindness', 'Science and Technology',
];

export default function ValueSelectionScreen({ navigation, formData }) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleValue = (value: string) => {
    setSelectedValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    const finalData = { ...formData, values: selectedValues };
    console.log(finalData); // Send this data to the backend
    // Continue to the next step or confirmation
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Choose Your Values/Topics</Text>
        <Text style={styles.subtitle}>Pick 5 or more</Text>
        <ScrollView contentContainerStyle={styles.valuesContainer}>
          {valuesList.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.valueBox,
                selectedValues.includes(value) && styles.selectedValueBox
              ]}
              onPress={() => toggleValue(value)}
            >
              <Text style={styles.valueText}>{value}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FEDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#F0DA60',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  valueBox: {
    width: '30%',
    margin: 5,
    padding: 10,
    backgroundColor: '#F0DA60',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedValueBox: {
    backgroundColor: '#1B3D2F',
  },
  valueText: {
    color: '#FFF',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1B3D2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
