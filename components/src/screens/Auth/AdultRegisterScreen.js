import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerUser } from '../../../../firebase';

const AdultRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: new Date(),
    cycleLength: '',
    periodLength: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    const { name, email, password } = formData;

    // Input validation
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'Name, email, and password are required.');
      return;
    }

    setIsRegistering(true);

    // Call the registerUser function from firebase/index.js
    const response = await registerUser({
      name,
      email,
      password,
      type: 'adult', // Specify user type if needed
      birthDate: formData.birthDate,
      cycleLength: formData.cycleLength,
      periodLength: formData.periodLength,
    });

    // Handle registration and email verification
    if (response.success) {
      Alert.alert(
        'Verify Your Email',
        'A verification email has been sent to your address. Please verify your email to proceed.',
        [{ text: 'OK', onPress: () => navigation.navigate('Verification', { email, type: 'adult' }) }]
      );
    } else {
      Alert.alert('Registration Error', response.message);
    }

    setIsRegistering(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FF69B4" />
      </TouchableOpacity>

      <Text style={styles.title}>Adult Registration</Text>
      <Text style={styles.subtitle}>Personalize your tracking experience</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
        </View>

        <TouchableOpacity 
          style={styles.dateContainer}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialCommunityIcons name="calendar" size={24} color="#999" />
          <Text style={styles.dateText}>
            {formData.birthDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.birthDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFormData({ ...formData, birthDate: selectedDate });
              }
            }}
          />
        )}

        <View style={styles.cycleLengthContainer}>
          <Text style={styles.cycleLengthTitle}>Average Cycle Length</Text>
          <View style={styles.cycleLengthInputs}>
            {[28, 29, 30, 31, 32].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.cycleLengthButton,
                  formData.cycleLength === days.toString() && styles.selectedCycleLength,
                ]}
                onPress={() => setFormData({ ...formData, cycleLength: days.toString() })}
              >
                <Text style={[
                  styles.cycleLengthButtonText,
                  formData.cycleLength === days.toString() && styles.selectedCycleLengthText,
                ]}>
                  {days}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={isRegistering}
        >
          <Text style={styles.registerButtonText}>
            {isRegistering ? 'Registering...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 10,
  },
  cycleLengthContainer: {
    marginTop: 20,
  },
  cycleLengthTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  cycleLengthInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cycleLengthButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCycleLength: {
    backgroundColor: '#FF69B4',
  },
  cycleLengthButtonText: {
    color: '#FF69B4',
    fontSize: 16,
  },
  selectedCycleLengthText: {
    color: '#FFF',
  },
  registerButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdultRegisterScreen;
