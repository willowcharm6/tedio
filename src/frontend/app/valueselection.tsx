import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { jsiConfigureProps } from 'react-native-reanimated/lib/typescript/reanimated2/core';

const valuesList = [
  { label: 'Respect', image: 'https://example.com/respect.png' },
  { label: 'Honesty', image: 'https://example.com/honesty.png' },
  { label: 'Responsibility', image: 'https://example.com/responsibility.png' },
  { label: 'Empathy', image: 'https://example.com/empathy.png' },
  { label: 'Courage', image: 'https://example.com/courage.png' },
  { label: 'Perseverance', image: 'https://example.com/perseverance.png' },
  { label: 'Gratitude', image: 'https://example.com/gratitude.png' },
  { label: 'Curiosity', image: 'https://example.com/curiosity.png' },
  { label: 'Kindness', image: 'https://example.com/kindness.png' },
  { label: 'Science and Technology', image: 'https://example.com/science.png' },
];

export default function ValueSelectionScreen({ navigation, formData }) {
/*  const [selectedValues, setSelectedValues] = useState([]);

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleNext = async () => {
    if (selectedValues.length < 5) {
      Alert.alert('Please select at least 5 values.');
      return;
    }

    const finalData = { ...formData, values: selectedValues };
    console.log(finalData); // Send this data to the backend

    try {
      // Example backend URL, replace with your actual endpoint
      const response = await fetch('https://your-backend-url.com/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const responseData = await response.json();
      console.log('Data submitted successfully:', responseData);
      Alert.alert('Success', 'Your data has been submitted!');

      navigation.navigate('VideoSelection');

    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data. Please try again.');
    }
  };*/
  const [selectedValues, setSelectedValues] = useState([]);

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    if (selectedValues.length < 5) {
      Alert.alert('Please select at least 5 values.');
      return;
    }

    const finalData = { ...formData, value_list: selectedValues.map(value => value.toLowerCase()) };
    console.log(finalData); // Log the data for now
    delete finalData.values

    const jsonFinalData = JSON.stringify(finalData)

    // Navigate to the VideoSelectionScreen without backend submission
    navigation.navigate('VideoSelection', { jsonFinalData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Choose Your Values/Topics</Text>
        <Text style={styles.subtitle}>Pick 5 or more</Text>
        <ScrollView contentContainerStyle={styles.valuesContainer}>
          {valuesList.map(({ label, image }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.valueBox,
                selectedValues.includes(label) && styles.selectedValueBox,
              ]}
              onPress={() => toggleValue(label)}
            >
              <Image source={{ uri: image }} style={styles.image} />
              <Text style={styles.valueText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Confirm</Text>
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
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#1B3D2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
});
