import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isOnSSR = typeof window === "undefined";
const isMobile = Platform.OS === "ios" || Platform.OS === "android";

function mobileGetItem(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}
function mobileSetItem(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}
function mobileRemoveItem(key: string): Promise<void> {
  return SecureStore.deleteItemAsync(key);
}

async function webGetItem(key: string): Promise<string | null> {
  if (isOnSSR) return null;
  return localStorage.getItem(key);
}

async function webSetItem(key: string, value: string): Promise<void> {
  localStorage.setItem(key, value);
}

async function webRemoveItem(key: string): Promise<void> {
  localStorage.removeItem(key);
}

const getItem = isMobile ? mobileGetItem : webGetItem;
const setItem = isMobile ? mobileSetItem : webSetItem;
const removeItem = isMobile ? mobileRemoveItem : webRemoveItem;

export { getItem, removeItem, setItem };
