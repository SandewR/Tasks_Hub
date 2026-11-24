import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Button, Feedback, Field, screenStyle } from '../../components/ui';
import { deletePhoto, loadPhotoUri, persistPhoto } from '../../lib/profile-photo';
import { clearTasksHubData, loadProfile, saveProfile } from '../../lib/storage';
import { colors } from '../../lib/theme';

type Message = { text: string; error?: boolean };

export default function ProfileScreen() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>({ text: '' });
  const savedUri = useRef<string | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    loadProfile()
      .then((profile) => {
        if (!mounted || !profile) return;
        setStudentName(profile.name);
        setStudentId(profile.id);
        savedUri.current = profile.imageUri;
        setProfileImage(loadPhotoUri(profile.imageUri));
      })
      .catch(() => {
        if (mounted) setMessage({ text: 'Could not load the saved profile.', error: true });
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  function show(title: string, text: string, error = false) {
    setMessage({ text, error });
    if (Platform.OS !== 'web') Alert.alert(title, text);
  }

  function begin() {
    if (busyRef.current || loading) return false;
    busyRef.current = true;
    setBusy(true);
    setMessage({ text: '' });
    return true;
  }

  function end() {
    busyRef.current = false;
    setBusy(false);
  }

  async function pickImage() {
    if (!begin()) return;
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          show('Permission required', 'Allow access to photos in the device settings and try again.', true);
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets[0]) {
        setPendingPhoto(result.assets[0]);
        setProfileImage(result.assets[0].uri);
        setMessage({ text: 'Photo selected. Save Details to keep it.' });
      }
    } catch {
      show('Image picker', 'Could not open the photo library. Please try again.', true);
    } finally {
      end();
    }
  }

  async function saveDetails() {
    if (busyRef.current || loading) return;
    const name = studentName.trim();
    const id = studentId.trim();
    if (!name || !id) {
      show('Error', 'Please enter both Name and Student ID.', true);
      return;
    }
    if (!begin()) return;

    const previousUri = savedUri.current;
    let newUri: string | null = null;
    try {
      if (pendingPhoto) newUri = await persistPhoto(pendingPhoto);
      const imageUri = newUri ?? previousUri;
      await saveProfile({ name, id, imageUri });
      savedUri.current = imageUri;
      setStudentName(name);
      setStudentId(id);
      setPendingPhoto(null);
      setProfileImage(loadPhotoUri(imageUri));
      if (newUri && previousUri !== newUri) deletePhoto(previousUri);
      show('Success', 'Profile details saved successfully!');
    } catch (error) {
      if (newUri && savedUri.current !== newUri) deletePhoto(newUri);
      const feedback = Platform.OS === 'web' && error instanceof Error && error.message.startsWith('On web')
        ? error.message : 'Could not save the profile. Please try again.';
      show('Error', feedback, true);
    } finally {
      end();
    }
  }

  async function clearAllData() {
    if (!begin()) return;
    try {
      await clearTasksHubData();
      deletePhoto(savedUri.current);
      savedUri.current = null;
      setStudentName('');
      setStudentId('');
      setProfileImage(null);
      setPendingPhoto(null);
      show('Success', 'Your saved tasks and profile have been cleared.');
    } catch {
      show('Error', 'Could not clear the saved data. Please try again.', true);
    } finally {
      end();
    }
  }

  function confirmClear() {
    const text = 'Remove all saved tasks and profile details from this device?';
    if (Platform.OS === 'web') {
      if (globalThis.confirm(text)) void clearAllData();
      return;
    }
    Alert.alert('Clear All TasksHub Data', text, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => { void clearAllData(); } },
    ]);
  }

  const locked = busy || loading;

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={screenStyle.content} keyboardShouldPersistTaps="handled">
        <View style={[screenStyle.card, styles.avatarCard]}>
          <TouchableOpacity style={styles.photoButton} activeOpacity={0.78} accessibilityRole="button"
            accessibilityLabel="Choose profile photo" onPress={pickImage} disabled={locked}>
            {profileImage ? <Image source={{ uri: profileImage }} style={styles.avatar} accessibilityLabel="Profile photo" /> : (
              <View style={[styles.avatar, styles.placeholder]}>
                <MaterialCommunityIcons name="account-outline" size={50} color={colors.accent} />
              </View>
            )}
            <View style={styles.edit}><MaterialCommunityIcons name="image-plus" size={17} color="#FFFFFF" /></View>
          </TouchableOpacity>
          <Text accessibilityRole="header" style={screenStyle.title}>Student Profile</Text>
          <Text style={screenStyle.body}>Tap the photo to choose one from your gallery.</Text>
        </View>

        {loading ? <ActivityIndicator color={colors.accent} accessibilityLabel="Loading profile" /> : null}

        <View style={screenStyle.card}>
          <Field label="Name" placeholder="Enter your name" value={studentName} onChangeText={setStudentName}
            maxLength={80} editable={!locked} autoCapitalize="words" />
          <Field label="Student ID" placeholder="Enter your student ID" value={studentId} onChangeText={setStudentId}
            maxLength={32} editable={!locked} autoCapitalize="characters" autoCorrect={false} />
          <Feedback message={message.text} error={message.error} />
          <Button label="Save Details" icon="content-save-outline" action={saveDetails} disabled={locked} />
        </View>
        <Button label="Clear All Data" icon="trash-can-outline" action={confirmClear} disabled={locked} danger />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  avatarCard: { alignItems: 'center', gap: 8, paddingTop: 22 },
  photoButton: { position: 'relative', marginBottom: 3 },
  avatar: { width: 91, height: 91, borderRadius: 46, backgroundColor: colors.pale },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  edit: {
    position: 'absolute', right: -2, bottom: -3, padding: 6, backgroundColor: colors.accent, borderRadius: 20,
    borderColor: colors.surface, borderWidth: 2,
  },
});
