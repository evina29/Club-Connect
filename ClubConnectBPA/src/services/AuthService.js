import {firebaseAuth, firebaseFirestore, COLLECTIONS} from '../config/firebase';

const auth = firebaseAuth();
const firestore = firebaseFirestore();

/**
 * Authentication Service
 * Handles user registration, login, and account recovery
 */
class AuthService {
  // Register new user
  async registerUser(email, password, userData) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password,
      );

      // Create user profile in Firestore
      await firestore
        .collection(COLLECTIONS.USERS)
        .doc(userCredential.user.uid)
        .set({
          email: email,
          name: userData.name || '',
          role: userData.role || 'student', // 'student' or 'admin'
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      return {success: true, user: userCredential.user};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Login user
  async loginUser(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password,
      );
      return {success: true, user: userCredential.user};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Logout user
  async logoutUser() {
    try {
      await auth.signOut();
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Send password reset email
  async resetPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return {success: true, message: 'Password reset email sent'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Get user profile from Firestore
  async getUserProfile(userId) {
    try {
      const userDoc = await firestore
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();

      if (userDoc.exists) {
        return {success: true, data: userDoc.data()};
      }
      return {success: false, error: 'User profile not found'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      await firestore
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .update({
          ...updates,
          updatedAt: new Date(),
        });
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

export default new AuthService();
