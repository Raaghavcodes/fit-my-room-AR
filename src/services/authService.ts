import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

// Web Client ID from Firebase Console -> Authentication -> Sign-in method -> Google -> Web SDK configuration
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID || '';

// Initialize Google Sign-In safely (in case it's run in Expo Go without native module)
try {
  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_IOS_CLIENT_ID || '',
    offlineAccess: true,
  });
} catch (error) {
  console.warn('Failed to configure GoogleSignin. This is expected in standard Expo Go.', error);
}

/**
 * Initiates the Google Sign-In flow and authenticates with Firebase.
 * Note: This requires a native build (npx expo run:ios/android) to function.
 */
export const signInWithGoogle = async () => {
  try {
    // Check if device supports Google Play services (mostly relevant for Android)
    await GoogleSignin.hasPlayServices();
    
    // Attempt sign in
    const userInfo = await GoogleSignin.signIn();
    
    if (userInfo.data?.idToken) {
      // Create a Firebase credential with the Google ID token
      const credential = GoogleAuthProvider.credential(userInfo.data.idToken);
      
      // Sign in with Firebase
      const userCredential = await signInWithCredential(auth, credential);
      return userCredential.user;
    } else {
      throw new Error('No ID token present in Google Sign-In response');
    }
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

/**
 * Signs out from both Firebase and Google
 */
export const logOut = async () => {
  try {
    await auth.signOut();
    // Also sign out from Google so next time they can choose an account.
    // We don't await this because if the native module is out of sync, it can hang indefinitely.
    GoogleSignin.signOut().catch((e) => {
      console.log('Google signOut error (likely not signed in with Google):', e);
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
