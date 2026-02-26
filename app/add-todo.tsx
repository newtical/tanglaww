import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddTodoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add new to do</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title:</Text>
          <TextInput style={styles.input} placeholder="Title of item" placeholderTextColor="#BDC3C7" />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Deadline:</Text>
          <View style={styles.inputWithIcon}>
            <TextInput style={{flex: 1}} placeholder="MM / DD / YYYY" placeholderTextColor="#BDC3C7" />
            <Ionicons name="calendar-outline" size={20} color="#FFB800" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time:</Text>
          <View style={styles.inputWithIcon}>
            <TextInput style={{flex: 1}} placeholder="HH : MM" placeholderTextColor="#BDC3C7" />
            <Ionicons name="time-outline" size={20} color="#FFB800" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Short details:</Text>
          <TextInput 
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
            placeholder="Write a brief description of your event" 
            placeholderTextColor="#BDC3C7"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { backgroundColor: '#0D2A94', height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  form: { padding: 25 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#BDC3C7', borderRadius: 8, padding: 12, fontSize: 14 },
  inputWithIcon: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BDC3C7', borderRadius: 8, paddingHorizontal: 12, height: 48 },
  saveButton: { backgroundColor: '#0D2A94', borderRadius: 8, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});