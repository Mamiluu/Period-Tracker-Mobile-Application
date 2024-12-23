import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, sendEmailVerification } from '../../../../firebase';

const VerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleVerify = async () => {
    const user = auth.currentUser;
    await user.reload();

    if (user && user.emailVerified) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } else {
      Alert.alert(
        'Not Verified',
        'Please click the verification link sent to your email to verify your account.',
        [{ text: 'OK' }]
      );
    }
  };

  const resendCode = async () => {
    if (timer === 0 && auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setTimer(30);
        Alert.alert('Verification Email Sent', 'Please check your inbox for the verification email.');
      } catch (error) {
        console.error('Error resending verification email:', error.message);
        Alert.alert('Error', 'Could not resend verification email.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FF69B4" />
      </TouchableOpacity>

      <View style={styles.content}>
        <MaterialCommunityIcons name="email-check-outline" size={80} color="#FF69B4" />
        
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>
          We've sent a verification email to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the email? </Text>
          <TouchableOpacity 
            onPress={resendCode}
            disabled={timer > 0}
          >
            <Text style={[
              styles.resendButton,
              timer > 0 && styles.resendButtonDisabled
            ]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#FF69B4',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  emailText: {
    color: '#FF69B4',
    fontWeight: 'bold',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF69B4',
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
  },
  codeInputFilled: {
    borderColor: '#FF69B4',
    backgroundColor: '#FFF0F6',
  },
  verifyButton: {
    backgroundColor: '#FF69B4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: '#666',
  },
  resendButton: {
    color: '#FF69B4',
    fontWeight: '600',
  },
  resendButtonDisabled: {
    color: '#FFB6C1',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default VerificationScreen;
