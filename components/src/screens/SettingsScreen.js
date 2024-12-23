import {
    StyleSheet,
    Text,
    View,
    Alert,
    ImageBackground,
    Dimensions,
    Switch,
    TouchableOpacity,
    useColorScheme,
    ScrollView,
    Platform,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import { en } from '../resources/translations/app/en';
  import { useNavigation } from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { MaterialIcons } from '@expo/vector-icons';
  
  // Define theme colors
  const themes = {
    light: {
      background: 'rgba(250, 250, 250, 0.9)',
      card: '#fff',
      text: '#000',
      subText: '#666',
      border: '#e1e1e1',
      switchTrack: '#81b0ff',
      switchThumb: '#f4f3f4',
      icon: '#000',
      shadow: '#000',
    },
    dark: {
      background: 'rgba(28, 28, 30, 0.95)',
      card: '#2c2c2e',
      text: '#fff',
      subText: '#a9a9a9',
      border: '#3d3d3d',
      switchTrack: '#81b0ff',
      switchThumb: '#f4f3f4',
      icon: '#fff',
      shadow: '#000',
    },
  };
  
  const SettingsScreen = () => {
    // State management
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const [cycleReminders, setCycleReminders] = useState(true);
    const [backupEnabled, setBackupEnabled] = useState(false);
    const [healthKitSync, setHealthKitSync] = useState(false);
    const [periodPrediction, setPeriodPrediction] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);
    const [loading, setLoading] = useState(true);
  
    const navigation = useNavigation();
    const systemColorScheme = useColorScheme();
  
    // Initialize theme and load saved preferences
    useEffect(() => {
      const loadPreferences = async () => {
        try {
          const savedPreferences = await AsyncStorage.multiGet([
            'darkMode',
            'notifications',
            'cycleReminders',
            'backup',
            'healthKit',
            'prediction',
            'sharing',
          ]);
  
          const preferencesObject = Object.fromEntries(savedPreferences);
          
          setDarkModeEnabled(JSON.parse(preferencesObject.darkMode) ?? (systemColorScheme === 'dark'));
          setNotificationsEnabled(JSON.parse(preferencesObject.notifications) ?? true);
          setCycleReminders(JSON.parse(preferencesObject.cycleReminders) ?? true);
          setBackupEnabled(JSON.parse(preferencesObject.backup) ?? false);
          setHealthKitSync(JSON.parse(preferencesObject.healthKit) ?? false);
          setPeriodPrediction(JSON.parse(preferencesObject.prediction) ?? true);
          setDataSharing(JSON.parse(preferencesObject.sharing) ?? false);
        } catch (error) {
          console.error('Error loading preferences:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadPreferences();
    }, [systemColorScheme]);
  
    // Save preferences when they change
    const savePreference = async (key, value) => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving ${key}:`, error);
      }
    };
  
    // Theme handling
    const currentTheme = darkModeEnabled ? themes.dark : themes.light;
    
    // Toggle handlers with persistence
    const handleDarkModeToggle = (value) => {
      setDarkModeEnabled(value);
      savePreference('darkMode', value);
    };
  
    const handleNotificationsToggle = (value) => {
      setNotificationsEnabled(value);
      savePreference('notifications', value);
    };
  
    const handleCycleRemindersToggle = (value) => {
      setCycleReminders(value);
      savePreference('cycleReminders', value);
    };
  
    const handleBackupToggle = (value) => {
      setBackupEnabled(value);
      savePreference('backup', value);
      if (value) {
        Alert.alert(
          'Cloud Backup',
          'Your data will be securely encrypted and backed up to the cloud. This helps you keep your data safe and accessible across devices.',
          [{ text: 'OK' }]
        );
      }
    };
  
    const handleHealthKitToggle = (value) => {
      setHealthKitSync(value);
      savePreference('healthKit', value);
      if (value && Platform.OS === 'ios') {
        // Here you would typically request HealthKit permissions
        Alert.alert(
          'Health App Integration',
          'This will sync your cycle data with Apple Health. You can manage this permission in your device settings at any time.',
          [{ text: 'OK' }]
        );
      }
    };
  
    const handlePredictionToggle = (value) => {
      setPeriodPrediction(value);
      savePreference('prediction', value);
    };
  
    const handleDataSharingToggle = (value) => {
      setDataSharing(value);
      savePreference('sharing', value);
      if (value) {
        Alert.alert(
          'Anonymous Data Sharing',
          'Your data will be anonymized and used to improve period predictions for all users. No personal information will be shared.',
          [{ text: 'OK' }]
        );
      }
    };
  
    // Action handlers
    const handleLogout = () => {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              try {
                await AsyncStorage.clear();
                Alert.alert("Success", "You have been logged out successfully");
                // Navigate to login screen
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } catch (error) {
                Alert.alert("Error", "Failed to logout. Please try again.");
              }
            }
          }
        ]
      );
    };
  
    const handleDeleteAccount = () => {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              // Here you would typically call an API to delete the account
              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ]
      );
    };
  
    const handleContactUs = () => {
      Alert.alert(
        'Contact Us',
        'Choose how you would like to contact us:',
        [
          {
            text: 'Send Email',
            onPress: () => {
              // Here you would typically use Linking to open email
              Alert.alert('Support Email', 'lvctdev@lvcthealth.org');
            }
          },
          {
            text: 'Help Center',
            onPress: () => navigation.navigate('HelpCenter')
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    };
  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ color: currentTheme.text }}>Loading...</Text>
        </View>
      );
    }
  
    // Render the main component
    return (
      <ImageBackground
        source={
          darkModeEnabled
            ? require('../../../assets/images/background/desert-default.png')
            : require('../../../assets/images/background/desert-default.png')
        }
        style={styles.background}
      >
        <ScrollView style={[styles.container, { backgroundColor: currentTheme.background }]}>
          <View style={styles.settingsWrapper}>
            {/* Notification Settings Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.sectionHeader, { color: currentTheme.text }]}>Notifications</Text>
              
              <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>Enable Notifications</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Get reminders for upcoming periods and fertile windows
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationsToggle}
                  trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                  thumbColor={notificationsEnabled ? '#f5dd4b' : currentTheme.switchThumb}
                />
              </View>
  
              <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>Daily Reminders</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Get prompts for logging symptoms and mood
                  </Text>
                </View>
                <Switch
                  value={cycleReminders}
                  onValueChange={handleCycleRemindersToggle}
                  trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                  thumbColor={cycleReminders ? '#f5dd4b' : currentTheme.switchThumb}
                />
              </View>
            </View>
  
            {/* App Settings Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.sectionHeader, { color: currentTheme.text }]}>App Settings</Text>
  
              <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Switch to dark theme for better night viewing
                  </Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={handleDarkModeToggle}
                  trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                  thumbColor={darkModeEnabled ? '#f5dd4b' : currentTheme.switchThumb}
                />
              </View>
  
              <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>Period Prediction</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Enable AI-powered cycle predictions
                  </Text>
                </View>
                <Switch
                  value={periodPrediction}
                  onValueChange={handlePredictionToggle}
                  trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                  thumbColor={periodPrediction ? '#f5dd4b' : currentTheme.switchThumb}
                />
              </View>
            </View>
  
            {/* Data & Privacy Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.sectionHeader, { color: currentTheme.text }]}>Data & Privacy</Text>
  
              <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>Cloud Backup</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Securely backup your data to the cloud
                  </Text>
                </View>
                <Switch
                  value={backupEnabled}
                  onValueChange={handleBackupToggle}
                  trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                  thumbColor={backupEnabled ? '#f5dd4b' : currentTheme.switchThumb}
                />
              </View>
  
              {Platform.OS === 'ios' && (
                <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingText, { color: currentTheme.text }]}>Health App Sync</Text>
                    <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                      Share cycle data with Apple Health
                    </Text>
                  </View>
                  <Switch
                    value={healthKitSync}
                    onValueChange={handleHealthKitToggle}
                    trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                    thumbColor={healthKitSync ? '#f5dd4b' : currentTheme.switchThumb}
                  />
                </View>
              )}
  
              <View style={[styles.settingItem, { backgroundColor: currentTheme.card }]}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>Anonymous Data Sharing</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Help improve predictions for all users
                  </Text>
                </View>
                <Switch
                  value={dataSharing}
                  onValueChange={handleDataSharingToggle}
                  trackColor={{ false: '#767577', true: currentTheme.switchTrack }}
                  thumbColor={dataSharing ? '#f5dd4b' : currentTheme.switchThumb}
                />
              </View>
            </View>
  
            {/* Information Section */}
            <View style={styles.settingsSection}>
              <Text style={[styles.sectionHeader, { color: currentTheme.text }]}>Information</Text>
  
              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: currentTheme.card }]}
                onPress={() => navigation.navigate('aboutScreen')}
              >
                <View style={styles.settingContent}>
                  <Text style={[styles.settingText, { color: currentTheme.text }]}>{en.about}</Text>
                  <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                    Learn more about our app
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
              </TouchableOpacity>
  
              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: currentTheme.card }]}
                onPress={() => navigation.navigate('TermsConditions')}
              />
              <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: currentTheme.card }]}
              onPress={() => navigation.navigate('TermsConditions')}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingText, { color: currentTheme.text }]}>{en.t_and_c}</Text>
                <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                  Review our terms of service
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: currentTheme.card }]}
              onPress={() => navigation.navigate('privacyPolicyScreen')}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingText, { color: currentTheme.text }]}>{en.privacy_policy}</Text>
                <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                  View our privacy policy
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: currentTheme.card }]}
              onPress={() => navigation.navigate('accessSettingsScreen')}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingText, { color: currentTheme.text }]}>{en.access_setting}</Text>
                <Text style={[styles.settingDescription, { color: currentTheme.subText }]}>
                  Manage app accessibility options
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={currentTheme.icon} />
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.logOutButton, { opacity: darkModeEnabled ? 0.9 : 1 }]} 
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.deleteAccountButton, { opacity: darkModeEnabled ? 0.9 : 1 }]} 
              onPress={handleDeleteAccount}
            >
              <MaterialIcons name="delete-forever" size={20} color={darkModeEnabled ? '#fff' : '#000'} style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: darkModeEnabled ? '#fff' : '#000' }]}>
                Delete account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.contactUsButton, { opacity: darkModeEnabled ? 0.9 : 1 }]} 
              onPress={handleContactUs}
            >
              <MaterialIcons name="contact-support" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Contact us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  settingsWrapper: {
    padding: 15,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
    padding: 10,
  },
  logOutButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    backgroundColor: '#FF8C00',
    paddingVertical: 13,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteAccountButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    backgroundColor: '#D1D0D2',
    paddingVertical: 13,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B7B6B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactUsButton: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    backgroundColor: '#97C800',
    paddingVertical: 13,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  }
});

export default SettingsScreen;