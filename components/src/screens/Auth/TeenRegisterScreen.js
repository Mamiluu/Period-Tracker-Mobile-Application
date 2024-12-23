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
import { auth, firestore } from '../../../../firebase'; // Adjust import if needed for Firebase setup

const TeenRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: new Date(),
    parentEmail: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async () => {
    // Validate age (13-17)
    const age = new Date().getFullYear() - formData.birthDate.getFullYear();
    if (age < 13 || age > 17) {
      Alert.alert('Age Restriction', 'You must be between 13-17 years old to register as a teen.');
      return;
    }

    try {
      // Register user in Firebase Auth
      const userCredential = await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await firestore.collection('users').doc(user.uid).set({
        name: formData.name,
        email: formData.email,
        birthDate: formData.birthDate,
        parentEmail: formData.parentEmail,
        accountType: 'teen',
        emailVerified: false,
      });

      // Send verification email
      await user.sendEmailVerification({
        url: 'https://yourapp.com/verify', // Update URL to redirect users after verification if needed
        handleCodeInApp: true,
      });

      // Navigate to Verification Screen
      navigation.navigate('Verification', { email: formData.email, type: 'teen' });
      Alert.alert(
        'Registration Successful',
        'A verification email has been sent. Please check your inbox.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Registration error:', error.message);
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FF69B4" />
      </TouchableOpacity>

      <Text style={styles.title}>Teen Registration</Text>
      <Text style={styles.subtitle}>Let's create your safe space</Text>

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

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="account-supervisor-outline" size={24} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Parent/Guardian Email"
            keyboardType="email-address"
            value={formData.parentEmail}
            onChangeText={(text) => setFormData({ ...formData, parentEmail: text })}
          />
        </View>

        <Text style={styles.notice}>
          Parent/Guardian approval required. They will receive an email to confirm your registration.
        </Text>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  notice: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#FF69B4',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TeenRegisterScreen;
