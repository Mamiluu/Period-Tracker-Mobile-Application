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
import { auth } from '../../../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const CoupleRegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    partner1Name: '',
    partner1Email: '',
    partner2Name: '',
    partner2Email: '',
    password: '',
  });

  const handleRegister = async () => {
    try {
      // Register Partner 1
      const user1Credential = await createUserWithEmailAndPassword(
        auth,
        formData.partner1Email,
        formData.password
      );
      const user1 = user1Credential.user;

      // Send email verification to Partner 1
      await sendEmailVerification(user1, {
        url: 'https://msanifuasiya@gmail.com' // Ensure this is your project's action URL
      });

      // Register Partner 2
      const user2Credential = await createUserWithEmailAndPassword(
        auth,
        formData.partner2Email,
        formData.password
      );
      const user2 = user2Credential.user;

      // Send email verification to Partner 2
      await sendEmailVerification(user2, {
        url: 'https://msanifuasiya@gmail.com'
      });

      // Navigate to Verification screen
      navigation.navigate('Verification', { 
        email: formData.partner1Email,
        partnerEmail: formData.partner2Email,
        type: 'couple'
      });

      // Display success alert
      Alert.alert(
        'Registration Successful',
        'Verification emails have been sent to both partners. Please check your inboxes.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Registration Error", error.message);
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

      <Text style={styles.title}>Couple Registration</Text>
      <Text style={styles.subtitle}>Track and share together</Text>

      <View style={styles.formContainer}>
        <View style={styles.partnerSection}>
          <Text style={styles.partnerTitle}>Partner 1</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.partner1Name}
              onChangeText={(text) => setFormData({...formData, partner1Name: text})}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={formData.partner1Email}
              onChangeText={(text) => setFormData({...formData, partner1Email: text})}
            />
          </View>
        </View>

        <View style={styles.partnerSection}>
          <Text style={styles.partnerTitle}>Partner 2</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={24} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.partner2Name}
              onChangeText={(text) => setFormData({...formData, partner2Name: text})}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={24} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={formData.partner2Email}
              onChangeText={(text) => setFormData({...formData, partner2Email: text})}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#999" />
          <TextInput
            style={styles.input}
            placeholder="Shared Password"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
          />
        </View>

        <Text style={styles.notice}>
          Both partners will receive verification emails to confirm the connection.
        </Text>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>Create Shared Account</Text>
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
  partnerSection: {
    marginBottom: 20,
  },
  partnerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
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
  notice: {
    fontSize: 14,
    color: '#666',
    marginVertical: 20,
    textAlign: 'center',
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

export default CoupleRegisterScreen;
