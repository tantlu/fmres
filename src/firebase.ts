import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const getGlobal = (key: string) => {
  if (typeof window !== 'undefined') return (window as unknown as Record<string, unknown>)[key];
  return undefined;
};

export const checkIsSandbox = () => typeof getGlobal('__firebase_config') !== 'undefined';

const YOUR_FIREBASE_CONFIG = {
  apiKey: (import.meta.env.VITE_FIREBASE_API_KEY as string) || "AIzaSyCSzggBgIGpa_galV9C2srBjVG8AFmxsYA",
  authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string) || "fmhub-ae832.firebaseapp.com",
  projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID as string) || "fmhub-ae832",
  storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string) || "fmhub-ae832.firebasestorage.app",
  messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || "948273341866",
  appId: (import.meta.env.VITE_FIREBASE_APP_ID as string) || "1:948273341866:web:0017bf1bf95c613def77d3",
  measurementId: (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string) || "G-TKF13CZEB0"
};

const sandboxConfig = getGlobal('__firebase_config');
const firebaseConfig = checkIsSandbox() && typeof sandboxConfig === 'string' ? JSON.parse(sandboxConfig) : YOUR_FIREBASE_CONFIG;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const globalAppId = getGlobal('__app_id');
export const appId: string = typeof globalAppId === 'string' ? globalAppId : 'default-app-id';

export const getCollectionRef = () => {
  if (checkIsSandbox()) {
    return collection(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1');
  }
  return collection(db, 'fm_resources_v1');
};