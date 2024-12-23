import React, { useState } from 'react';
import { View, Text, Button, Share, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
const AccessSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing app!'
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Access Settings</Text> */}
      {/* Language Picker */}
      <View style={styles.languageContainer}>
        <View >
          <Text style={styles.settingText}>Language</Text>
          <Text style={styles.subText}>Change the language</Text>
        </View>
        <RNPickerSelect
          onValueChange={(value) => setSelectedLanguage(value)}
          items={[
            { label: 'English', value: 'en' },
            { label: 'Swahili', value: 'sw' },
            { label: 'French', value: 'fr' },
          ]}
          value={selectedLanguage}
          style={pickerSelectStyles}
        />
      </View>
      {/* Share App */}
      <View style={styles.languageContainer}>
        <View>
          <Text style={styles.settingText}>Share</Text>
          <Text style={styles.subText}>Share Oky with your friends</Text>
        </View>
        <Button title="Share" onPress={handleShare} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5'
},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15
  },
  settingText: {
    fontSize: 18,
    // marginBottom:5
  },
  languageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: '',
      padding: 20,
      backgroundColor: '#fff',
      marginBottom: 1,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    languageTextContainer: {
      flex: 1, // Allows the text container to take up available space
      marginRight: 10,
    },
  subText: {
    fontSize: 14,
    color: 'gray', // Optional styling for the subtext
    // marginBottom:10
    // textAlign:'right'
  },
  settingItem1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 1,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    alignSelf:'flex-end'
},
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    alignSelf:'flex-end'
  }
});
export default AccessSettings;