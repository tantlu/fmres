import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const getGlobal = (key: string) => {
  if (typeof window !== 'undefined') return (window as any)[key];
  return undefined;
};

export const checkIsSandbox = () => typeof getGlobal('__firebase_config') !== 'undefined';

const YOUR_FIREBASE_CONFIG = {
  apiKey: "AIzaSyCSzggBgIGpa_galV9C2srBjVG8AFmxsYA",
  authDomain: "fmhub-ae832.firebaseapp.com",
  projectId: "fmhub-ae832",
  storageBucket: "fmhub-ae832.firebasestorage.app",
  messagingSenderId: "948273341866",
  appId: "1:948273341866:web:0017bf1bf95c613def77d3",
  measurementId: "G-TKF13CZEB0"
};

const sandboxConfig = getGlobal('__firebase_config');
const firebaseConfig = checkIsSandbox() ? JSON.parse(sandboxConfig) : YOUR_FIREBASE_CONFIG;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const globalAppId = getGlobal('__app_id');
export const appId = typeof globalAppId !== 'undefined' ? globalAppId : 'default-app-id';

export const getCollectionRef = () => {
  if (checkIsSandbox()) {
    return collection(db, 'artifacts', appId, 'public', 'data', 'fm_resources_v1');
  }
  return collection(db, 'fm_resources_v1');
};