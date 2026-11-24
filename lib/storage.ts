import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';
const PROFILE_KEY = 'studentProfile';

export type Task = {
  id: string;
  taskName: string;
  taskDescription: string;
};

export type StudentProfile = {
  name: string;
  id: string;
  imageUri: string | null;
};

export async function loadTasks(): Promise<Task[]> {
  const stored = await AsyncStorage.getItem(TASKS_KEY);
  if (stored === null) return [];
  const tasks: unknown = JSON.parse(stored);
  if (!Array.isArray(tasks) || !tasks.every((task) =>
    task && typeof task.id === 'string' &&
    typeof task.taskName === 'string' && typeof task.taskDescription === 'string'
  )) {
    throw new Error('The stored task list could not be read.');
  }
  return tasks;
}

export async function addTask(taskName: string, taskDescription: string) {
  const tasks = await loadTasks();
  const task: Task = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    taskName,
    taskDescription,
  };
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify([task, ...tasks]));
}

export async function loadProfile(): Promise<StudentProfile | null> {
  const stored = await AsyncStorage.getItem(PROFILE_KEY);
  if (stored === null) return null;
  const data: unknown = JSON.parse(stored);
  if (!data || typeof data !== 'object' ||
      !('name' in data) || typeof data.name !== 'string' ||
      !('id' in data) || typeof data.id !== 'string' ||
      !('imageUri' in data) || (data.imageUri !== null && typeof data.imageUri !== 'string')) {
    throw new Error('The saved profile could not be read.');
  }
  return { name: data.name, id: data.id, imageUri: data.imageUri };
}

export function saveProfile(profile: StudentProfile) {
  return AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearTasksHubData() {
  return AsyncStorage.multiRemove([TASKS_KEY, PROFILE_KEY]);
}
