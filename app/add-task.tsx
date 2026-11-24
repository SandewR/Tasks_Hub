import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Backdrop, Button, Feedback, Field, screenStyle } from '../components/ui';
import { notifyTaskSaved } from '../lib/notifications';
import { addTask } from '../lib/storage';
import { assignmentImages, colors } from '../lib/theme';

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [saving, setSaving] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);
  const saveLock = useRef(false);

  function showError(message: string) {
    setProblem(message);
    if (Platform.OS !== 'web') Alert.alert('Error', message);
  }

  async function saveTask() {
    if (saveLock.current) return;
    const name = taskName.trim();
    const description = taskDescription.trim();
    if (!name || !description) {
      showError('Please fill in both fields.');
      return;
    }

    saveLock.current = true;
    setSaving(true);
    setProblem('');
    Keyboard.dismiss();

    try {
      await addTask(name, description);
      let notice = '';
      if (Platform.OS !== 'web') {
        try {
          if (!(await notifyTaskSaved(name))) {
            notice = 'Turn on notifications in Settings to see future task alerts.';
          }
        } catch {
          notice = 'Your task is saved. The device could not show the notification.';
        }
      }
      if (router.canGoBack()) router.back();
      else router.replace('/');
      if (notice) Alert.alert('Task saved', notice);
    } catch {
      showError('Could not save the task. Please try again.');
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  return (
    <Backdrop>
      <SafeAreaView edges={['bottom']} style={styles.flex}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={screenStyle.content} keyboardShouldPersistTaps="handled">
            <View style={[screenStyle.card, styles.banner]}>
              {bannerFailed ? (
                <View style={styles.artFallback}>
                  <MaterialCommunityIcons name="calendar-check-outline" size={42} color={colors.accent} />
                  <Text style={screenStyle.eyebrow}>PLAN YOUR NEXT TASK</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: assignmentImages.banner }}
                  resizeMode="contain"
                  style={styles.art}
                  onError={() => setBannerFailed(true)}
                />
              )}
            </View>
            <View style={screenStyle.card}>
              <Text style={screenStyle.eyebrow}>NEW ENTRY</Text>
              <Field label="Task Name" placeholder="e.g. Complete Practical 07" value={taskName} onChangeText={setTaskName}
                maxLength={90} editable={!saving} />
              <Field label="Task Description" placeholder="What do you need to do?" value={taskDescription}
                onChangeText={setTaskDescription} multiline numberOfLines={4} maxLength={600} editable={!saving} />
              <Feedback message={problem} error />
              <Button label={saving ? 'Saving…' : 'Save Task'} icon="content-save-outline" action={saveTask} disabled={saving} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  banner: { padding: 8, overflow: 'hidden' },
  art: { width: '100%', height: 135, backgroundColor: colors.surface },
  artFallback: { height: 135, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.pale, borderRadius: 12 },
});
