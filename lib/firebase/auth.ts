// Firebase Authentication
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

export interface UserData {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  role: 'client' | 'vendor' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: any;
  updatedAt: any;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  // Client specific
  preferences?: string[];
  addresses?: any[];
  // Vendor specific
  businessName?: string;
  businessType?: string;
  siret?: string;
  // Admin specific
  permissions?: string[];
}

// ============================================
// INSCRIPTION
// ============================================

export async function signupWithEmail(
  email: string,
  password: string,
  userData: Partial<UserData>
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      ...userData,
      role: userData.role || 'client',
      status: 'active',
      emailVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ User signed up:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Signup error:', error);
    return { success: false, error: error.message };
  }
}

export async function signupWithPhone(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string }> {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    console.log('✅ OTP sent');
    return { success: true, confirmationResult };
  } catch (error: any) {
    console.error('❌ Phone signup error:', error);
    return { success: false, error: error.message };
  }
}

export async function verifyOTP(
  confirmationResult: ConfirmationResult,
  code: string,
  userData: Partial<UserData>
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const result = await confirmationResult.confirm(code);
    const user = result.user;

    // Create user profile
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      ...userData,
      role: userData.role || 'client',
      status: 'active',
      phoneVerified: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ OTP verified:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ OTP verification error:', error);
    return { success: false, error: error.message };
  }
}

export async function signupWithGoogle(
  role: 'client' | 'vendor' | 'admin' = 'client'
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
        status: 'active',
        emailVerified: user.emailVerified,
        provider: 'google',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.log('✅ Google signup successful:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Google signup error:', error);
    return { success: false, error: error.message };
  }
}

export async function signupWithFacebook(
  role: 'client' | 'vendor' | 'admin' = 'client'
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role,
        status: 'active',
        emailVerified: user.emailVerified,
        provider: 'facebook',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.log('✅ Facebook signup successful:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Facebook signup error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// CONNEXION
// ============================================

export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: serverTimestamp(),
    });

    console.log('✅ Login successful:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return { success: false, error: error.message };
  }
}

export async function loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: serverTimestamp(),
    });

    console.log('✅ Google login successful:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Google login error:', error);
    return { success: false, error: error.message };
  }
}

export async function loginWithFacebook(): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: serverTimestamp(),
    });

    console.log('✅ Facebook login successful:', user.uid);
    return { success: true, user };
  } catch (error: any) {
    console.error('❌ Facebook login error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// DÉCONNEXION
// ============================================

export async function logout(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut(auth);
    console.log('✅ Logout successful');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// MOT DE PASSE
// ============================================

export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    return { success: false, error: error.message };
  }
}

export async function changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    await updatePassword(user, newPassword);
    console.log('✅ Password changed');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Password change error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// PROFIL
// ============================================

export async function getUserProfile(userId?: string): Promise<{ success: boolean; profile?: UserData; error?: string }> {
  try {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error('No user ID provided');

    const docSnap = await getDoc(doc(db, 'users', uid));

    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() as UserData };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  } catch (error: any) {
    console.error('❌ Get profile error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(data: Partial<UserData>): Promise<{ success: boolean; error?: string }> {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('No user logged in');

    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Profile updated');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Update profile error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// AUTH STATE LISTENER
// ============================================

export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}

export function isUserLoggedIn(): boolean {
  return auth.currentUser !== null;
}
