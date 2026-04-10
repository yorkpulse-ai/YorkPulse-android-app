import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { clearUser } from '../storage/auth';
import { api } from '../api/client';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMe() {
      try {
        const { ok, data } = await api.me();
        if (ok && data) {
          setUsername(data.username || data.user?.username || 'User');
        } else {
          setError('Failed to load user info.');
        }
      } catch (e) {
        setError('Network error while loading profile.');
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, []);

  async function handleLogout() {
    try {
      await api.logout();
    } catch (e) {
    }
    await clearUser();
    navigation.replace('Login');
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Text style={styles.title}>Welcome, {username}</Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <Text style={styles.btnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d131a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: '#f87171',
    marginBottom: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});