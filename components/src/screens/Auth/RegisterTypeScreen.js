import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterTypeScreen = ({ navigation }) => {
  const registerTypes = [
    {
      title: 'Teen',
      icon: 'human-female',
      description: 'Ages 13-17',
      gradient: ['#FFB6C1', '#FFC0CB'],
      route: 'TeenRegister'
    },
    {
      title: 'Adult',
      icon: 'human-female',
      description: 'Ages 18+',
      gradient: ['#FF69B4', '#FF1493'],
      route: 'AdultRegister'
    },
    {
      title: 'Couple',
      icon: 'account-multiple',
      description: 'Track together',
      gradient: ['#DA70D6', '#BA55D3'],
      route: 'CoupleRegister'
    },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FF69B4" />
      </TouchableOpacity>

      <Text style={styles.title}>Choose Your Journey</Text>
      <Text style={styles.subtitle}>Select the option that best describes you</Text>

      <View style={styles.cardsContainer}>
        {registerTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(type.route)}
            style={styles.cardWrapper}
          >
            <LinearGradient
              colors={type.gradient}
              style={styles.card}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name={type.icon} size={40} color="#FFF" />
              <Text style={styles.cardTitle}>{type.title}</Text>
              <Text style={styles.cardDescription}>{type.description}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  cardsContainer: {
    gap: 20,
  },
  cardWrapper: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.2,
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cardDescription: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 5,
  },
});
export default RegisterTypeScreen;
