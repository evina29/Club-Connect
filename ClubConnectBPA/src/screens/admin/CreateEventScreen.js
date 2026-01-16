import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import EventService from '../../services/EventService';
import CalendarAPIService from '../../services/CalendarAPIService';

const CreateEventScreen = ({route, navigation}) => {
  const {clubId} = route.params;
  const {user} = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async () => {
    if (!title.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Error', 'Please fill in required fields (title, date, time)');
      return;
    }

    // Parse date and time (format: YYYY-MM-DD and HH:MM)
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour

    if (isNaN(startDateTime.getTime())) {
      Alert.alert('Error', 'Invalid date or time format');
      return;
    }

    setLoading(true);

    // Create event in database
    const eventResult = await EventService.createEvent(
      {
        title,
        description,
        location,
        startDate: startDateTime,
        endDate: endDateTime,
      },
      clubId,
      user.uid,
    );

    if (eventResult.success) {
      // Try to add to calendar API
      const calendarResult = await CalendarAPIService.addEventToCalendar({
        title,
        description,
        location,
        startDate: startDateTime,
        endDate: endDateTime,
      });

      setLoading(false);

      if (calendarResult.success) {
        Alert.alert('Success', 'Event created and added to calendar!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } else {
        Alert.alert(
          'Partial Success',
          'Event created but failed to sync with calendar',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
      }
    } else {
      setLoading(false);
      Alert.alert('Error', eventResult.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter event description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event location"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2024-12-25"
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Time * (HH:MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="14:00"
          value={time}
          onChangeText={setTime}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateEvent}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Event</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;
