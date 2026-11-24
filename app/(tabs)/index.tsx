import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Backdrop, Button, Feedback, screenStyle } from '../../components/ui';
import { loadTasks, type Task } from '../../lib/storage';
import { colors } from '../../lib/theme';

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState('');

  useFocusEffect(useCallback(() => {
    let active = true;
    setProblem('');

    loadTasks()
      .then((items) => { if (active) setTasks(items); })
      .catch(() => { if (active) setProblem('Could not load your tasks. Switch tabs and try again.'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []));

  return (
    <Backdrop>
      <ScrollView contentContainerStyle={screenStyle.content}>
        <View style={styles.hero}>
          <View style={styles.heroText}>
            <Text style={styles.kicker}>TASKSHUB</Text>
            <Text accessibilityRole="header" style={styles.title}>Your Tasks</Text>
            <Text style={styles.heroBody}>Keep track of what you need to do.</Text>
          </View>
          <View style={styles.heroIcon}><MaterialCommunityIcons name="clipboard-check-outline" size={33} color="#CAFAE9" /></View>
        </View>

        <Button label="Add New Task" icon="plus" action={() => router.push('/add-task')} />

        <View style={styles.headingRow}>
          <Text style={styles.heading}>Saved tasks</Text>
          {loading ? null : <Text style={styles.count}>{tasks.length}</Text>}
        </View>

        {loading ? <ActivityIndicator color={colors.accent} accessibilityLabel="Loading tasks" /> : null}
        <Feedback message={problem} error />
        {!loading && !problem && tasks.length === 0 ? (
          <View style={[screenStyle.card, styles.empty]}>
            <MaterialCommunityIcons name="clipboard-text-outline" color={colors.accent} size={29} />
            <Text style={styles.heading}>No tasks saved yet</Text>
            <Text style={[screenStyle.body, styles.center]}>Add a task to start your list.</Text>
          </View>
        ) : null}
        {tasks.map((task) => (
          <View key={task.id} style={[screenStyle.card, styles.taskCard]}>
            <View style={styles.taskIcon}><MaterialCommunityIcons name="format-list-checks" size={20} color={colors.accent} /></View>
            <View style={styles.taskText}>
              <Text accessibilityRole="header" style={styles.heading}>{task.taskName}</Text>
              <Text style={screenStyle.body}>{task.taskDescription}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 22, padding: 20, gap: 10, backgroundColor: colors.darkAccent, flexDirection: 'row', alignItems: 'center' },
  heroText: { flex: 1, gap: 5 },
  kicker: { color: '#B3F0DD', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.surface, fontSize: 31, fontWeight: '800', letterSpacing: -0.8 },
  heroBody: { color: '#D7EEE9', lineHeight: 21, fontSize: 14 },
  heroIcon: { borderRadius: 18, padding: 11, backgroundColor: '#2A5D58' },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 2 },
  heading: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  count: { color: colors.accent, backgroundColor: colors.pale, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, fontWeight: '800' },
  empty: { paddingVertical: 32, alignItems: 'center', gap: 7 },
  center: { textAlign: 'center' },
  taskCard: { flexDirection: 'row', alignItems: 'flex-start' },
  taskIcon: { marginTop: 2, backgroundColor: colors.pale, borderRadius: 10, padding: 8 },
  taskText: { flex: 1, gap: 4 },
});
