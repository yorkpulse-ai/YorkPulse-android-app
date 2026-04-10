import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert
} from 'react-native';
import { api } from '../api/client';
import { saveUser } from '../storage/auth';

export default function LoginScreen({ navigation }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!account.trim() || !password.trim()) {
      setError('Please enter your username/email and password.');
      return;
    }

    const payload = { password };
    if (account.includes('@')) {
      payload.email = account.trim().toLowerCase();
    } else {
      payload.username = account.trim();
    }

    setLoading(true);
    try {
      const { ok, data } = await api.login(payload);

     if (ok && data.ok) {
       await saveUser({ username: data.username });
       navigation.replace('Home');
     } else {
        setError(data.message || 'Login failed.');
        if (data.ban_reason) {
          setError(`Account banned: ${data.ban_reason}`);
        }
      }
    } catch (e) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>York Pulse</Text>
        <Text style={styles.subtitle}>University Community</Text>

        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#888"
          value={account}
          onChangeText={setAccount}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Sign In</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d131a',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#171d26',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#283140',
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4ade80',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: '#8899aa',
    textAlign: 'center',
    marginBottom: 28,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#0d131a',
    borderWidth: 1,
    borderColor: '#283140',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    marginBottom: 14,
    fontSize: 15,
  },
  btn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 6,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#f87171',
    marginBottom: 10,
    fontSize: 13,
    textAlign: 'center',
  },
  link: {
    color: '#4ade80',
    textAlign: 'center',
    marginTop: 18,
    fontSize: 13,
  },
});
