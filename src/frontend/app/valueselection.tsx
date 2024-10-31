import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { jsiConfigureProps } from 'react-native-reanimated/lib/typescript/reanimated2/core';

const valuesList = [
  { label: 'Respect', image: './../assets/images/1 Respect.jpg' },
  { label: 'Honesty', image: './../assets/images/2 Honesty.jpg' },
  { label: 'Responsibility', image: './../assets/images/3 responsibility.jpg' },
  { label: 'Empathy', image: './../assets/images/4 empathy.jpg' },
  { label: 'Courage', image: './../assets/images/5 courage.jpg' },
  { label: 'Perseverance', image: './../assets/images/6 preserverance.jpg' },
  { label: 'Gratitude', image: './../assets/images/7 gratitude.jpg' },
  { label: 'Curiosity', image: './../assets/images/8 curiosity.jpg' },
  { label: 'Kindness', image: './../assets/images/9 kindness.jpg' },
  { label: 'Science and Technology', image: './../assets/images/10 science and tech.jpg' },
  { label: 'Storytelling', image: './../assets/images/11 Storytelling.jpg' },
  { label: 'Historical Adventure', image: './../assets/images/12 historical adventure.jpg' },
  { label: 'Arts and DIY', image: './../assets/images/13 artss and diy.jpg' },
  { label: 'Geography', image: './../assets/images/14 geography.jpg' },
  { label: 'Coding and Tech', image: './../assets/images/15 coding and tech.jpg' },
  { label: 'Active Movement', image: './../assets/images/16 active movement.jpg' },
  { label: 'Language', image: './../assets/images/17 language.jpg' },
  { label: 'Nature and Wildlife', image: './../assets/images/18 nature and wildlife.jpg' },
  { label: 'Inspirational', image: './../assets/images/19 inspirational.jpg' },
  { label: 'Cooking', image: './../assets/images/20 cooking.jpg' },
  { label: 'Phonics', image: './../assets/images/21 phonics.jpg' },
  { label: 'Vocab', image: './../assets/images/22 vocab.jpg' },
  { label: 'Safety and Life Skills', image: './../assets/images/23 Safety and life skills.jpg' },
  { label: 'Kids Songs', image: './../assets/images/24 kids songs.jpg' },
  { label: 'Exploration', image: './../assets/images/25 exploration.jpg' },
  { label: 'Problem Solving', image: './../assets/images/26 porb solving.jpg' },
  { label: 'Diversity', image: './../assets/images/27 diversity.jpg' },
  { label: 'Storytelling', image: './../assets/images/28 storytelling.jpg' },
  { label: 'Recycling', image: './../assets/images/29 recycling.jpg' },
  { label: 'Ecosystem', image: './../assets/images/30 ecosystem.jpg' },
  { label: 'Biographies', image: './../assets/images/31 biographies.jpg' },
  { label: 'Family Activities', image: './../assets/images/32 fam activities.jpg' },
  { label: 'Teamwork', image: './../assets/images/33 teamwork.jpg' }
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
