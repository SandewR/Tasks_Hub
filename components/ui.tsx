import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { assignmentImages, colors } from '../lib/theme';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export function Backdrop({ children }: { children: ReactNode }) {
  return (
    <ImageBackground source={{ uri: assignmentImages.background }} style={styles.backdrop} imageStyle={styles.bgImage}>
      {children}
    </ImageBackground>
  );
}

export function Button({ label, icon, action, danger, disabled }: {
  label: string;
  icon: IconName;
  action: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      activeOpacity={0.78}
      style={[styles.button, danger && styles.danger, disabled && styles.disabled]}
      onPress={action}
      disabled={disabled}
    >
      <MaterialCommunityIcons name={icon} size={21} color={danger ? colors.error : colors.surface} />
      <Text style={[styles.buttonText, danger && styles.dangerText]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.secondary}
        style={[styles.input, props.multiline && styles.multiline]}
      />
    </View>
  );
}

export function Feedback({ message, error = false }: { message: string; error?: boolean }) {
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={[styles.feedback, error && styles.feedbackError]}>
      {message}
    </Text>
  );
}

export const screenStyle = StyleSheet.create({
  content: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 18, gap: 15, paddingBottom: 24 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.ink, fontSize: 31, fontWeight: '800', letterSpacing: -0.8 },
  body: { color: colors.secondary, fontSize: 14, lineHeight: 21 },
  card: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 17, borderColor: colors.border,
    borderWidth: 1, gap: 12,
  },
});

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.bg },
  bgImage: { opacity: 0.17 },
  button: {
    minHeight: 50, borderRadius: 13, backgroundColor: colors.accent, paddingVertical: 12,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  buttonText: { color: colors.surface, fontWeight: '800', fontSize: 15 },
  danger: { backgroundColor: colors.errorBg, borderColor: '#F4CAD4', borderWidth: 1 },
  dangerText: { color: colors.error },
  disabled: { opacity: 0.6 },
  field: { gap: 6 },
  label: { color: colors.ink, fontWeight: '700', fontSize: 14 },
  input: {
    color: colors.ink, fontSize: 15, borderColor: colors.border, borderWidth: 1, borderRadius: 11,
    paddingHorizontal: 12, paddingVertical: 11, minHeight: 47, backgroundColor: '#FCFDFE',
  },
  multiline: { minHeight: 108, textAlignVertical: 'top' },
  feedback: {
    color: colors.darkAccent, backgroundColor: colors.pale, padding: 11, borderRadius: 10,
    fontSize: 14, fontWeight: '600', lineHeight: 20,
  },
  feedbackError: { color: colors.error, backgroundColor: colors.errorBg },
});
