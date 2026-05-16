import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api/client';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTeammate'>;

export function AddTeammateScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ name?: string; job?: string }>({});

  async function handleSubmit() {
    const errors: { name?: string; job?: string } = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!job.trim()) errors.job = 'Job title is required';
    if (Object.keys(errors).length) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors({});
    try {
      await api.createUser(name.trim(), job.trim());
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, validationErrors.name ? styles.inputError : null]}
          value={name}
          onChangeText={(text) => { setName(text); setValidationErrors((e) => ({ ...e, name: undefined })); }}
          placeholder="Full name"
          autoCapitalize="words"
          returnKeyType="next"
          editable={!loading && !success}
        />
        {validationErrors.name ? <Text style={styles.fieldError}>{validationErrors.name}</Text> : null}

        <Text style={[styles.label, styles.labelSpacing]}>Job title</Text>
        <TextInput
          style={[styles.input, validationErrors.job ? styles.inputError : null]}
          value={job}
          onChangeText={(text) => { setJob(text); setValidationErrors((e) => ({ ...e, job: undefined })); }}
          placeholder="e.g. Software Engineer"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!loading && !success}
        />
        {validationErrors.job ? <Text style={styles.fieldError}>{validationErrors.job}</Text> : null}

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>Failed to add teammate</Text>
            <Text style={styles.errorDetail}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <Text style={styles.successText}>Teammate added!</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, (loading || success) ? styles.buttonDisabled : null]}
          onPress={handleSubmit}
          disabled={loading || success}
          accessibilityLabel="Add teammate"
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonLabel}>Add Teammate</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 6 },
  labelSpacing: { marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#c00' },
  fieldError: { fontSize: 12, color: '#c00', marginTop: 4 },
  errorBanner: { marginTop: 20, padding: 12, backgroundColor: '#fff0f0', borderRadius: 8 },
  errorText: { fontSize: 14, fontWeight: '600', color: '#c00' },
  errorDetail: { fontSize: 12, color: '#666', marginTop: 2 },
  successText: { marginTop: 20, fontSize: 15, fontWeight: '600', color: '#2a7a2a', textAlign: 'center' },
  button: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
