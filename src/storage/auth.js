import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'yorkpulse_user';

export async function saveUser(user) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}

