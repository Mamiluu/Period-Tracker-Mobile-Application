import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [symptoms, setSymptoms] = useState({});
  const [periodDates, setPeriodDates] = useState({});
  const [nextPeriodDate, setNextPeriodDate] = useState('');

  // Theme for the calendar
  const theme = {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    selectedDayBackgroundColor: '#ff69b4',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#ff69b4',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#ff69b4',
    selectedDotColor: '#ffffff',
    arrowColor: '#ff69b4',
    monthTextColor: '#2d4150',
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14
  };

  // Predefined symptoms list
  const symptomsList = [
    { id: 1, name: 'Cramps', icon: 'stomach' },
    { id: 2, name: 'Headache', icon: 'head' },
    { id: 3, name: 'Mood Swings', icon: 'emoticon-sad' },
    { id: 4, name: 'Fatigue', icon: 'power-sleep' },
    { id: 5, name: 'Bloating', icon: 'water' }
  ];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const toggleSymptom = (date, symptomId) => {
    setSymptoms(prev => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [symptomId]: !(prev[date]?.[symptomId])
      }
    }));
  };

  const togglePeriodDay = (date) => {
    setPeriodDates(prev => ({
      ...prev,
      [date]: {
        marked: !prev[date]?.marked,
        dotColor: '#ff69b4',
        selectedColor: '#ff69b4'
      }
    }));
    
    // Calculate and set next period date (28 days from the first day)
    if (!periodDates[date]?.marked) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 28);
      setNextPeriodDate(nextDate.toISOString().split('T')[0]);
    }
  };

  const handleFitnessLog = () => {
    Alert.alert(
      "Fitness Tracking",
      "Log your activity for today:",
      [
        {
          text: "Add Exercise",
          onPress: () => console.log("Exercise logging to be implemented")
        },
        {
          text: "View Statistics",
          onPress: () => console.log("Statistics to be implemented")
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const renderSymptomModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>
          {selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
        </Text>
        
        <TouchableOpacity
          style={styles.periodToggle}
          onPress={() => togglePeriodDay(selectedDate)}
        >
          <Text style={styles.periodToggleText}>
            {periodDates[selectedDate]?.marked ? 'Remove Period Day' : 'Mark Period Day'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.symptomsTitle}>Track Symptoms:</Text>
        <ScrollView>
          {symptomsList.map(symptom => (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomItem,
                symptoms[selectedDate]?.[symptom.id] && styles.symptomItemActive
              ]}
              onPress={() => toggleSymptom(selectedDate, symptom.id)}
            >
              <Icon name={symptom.icon} size={24} color={symptoms[selectedDate]?.[symptom.id] ? '#ffffff' : '#ff69b4'} />
              <Text style={[
                styles.symptomText,
                symptoms[selectedDate]?.[symptom.id] && styles.symptomTextActive
              ]}>
                {symptom.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Calendar
        theme={theme}
        onDayPress={handleDayPress}
        markedDates={{
          ...periodDates,
          [nextPeriodDate]: {
            marked: true,
            dotColor: '#add8e6',
            selectedColor: '#add8e6'
          }
        }}
        markingType={'dot'}
      />

      {nextPeriodDate && (
        <View style={styles.predictionBox}>
          <Text style={styles.predictionText}>
            Next period predicted: {new Date(nextPeriodDate).toLocaleDateString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.fitnessButton}
        onPress={handleFitnessLog}
      >
        <Icon name="run" size={24} color="#ffffff" />
        <Text style={styles.fitnessButtonText}>Track Fitness</Text>
      </TouchableOpacity>

      {renderSymptomModal()}
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  predictionBox: {
    backgroundColor: '#fff0f5',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  predictionText: {
    color: '#ff69b4',
    fontSize: 16,
    fontWeight: '500',
  },
  fitnessButton: {
    backgroundColor: '#ff69b4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    margin: 10,
  },
  fitnessButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 100,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d4150',
  },
  symptomsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#2d4150',
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff0f5',
    borderRadius: 10,
    marginVertical: 5,
    width: 250,
  },
  symptomItemActive: {
    backgroundColor: '#ff69b4',
  },
  symptomText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#ff69b4',
  },
  symptomTextActive: {
    color: '#ffffff',
  },
  periodToggle: {
    backgroundColor: '#ff69b4',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  periodToggleText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#2d4150',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: 200,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});