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
import AnnouncementService from '../../services/AnnouncementService';

const CreateAnnouncementScreen = ({route, navigation}) => {
  const {clubId} = route.params;
  const {user} = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await AnnouncementService.createAnnouncement(
      clubId,
      title,
      content,
      user.uid,
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Announcement created!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter announcement title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter announcement content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateAnnouncement}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Post Announcement</Text>
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
    height: 150,
  },
  button: {
    backgroundColor: '#2196F3',
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

export default CreateAnnouncementScreen;
