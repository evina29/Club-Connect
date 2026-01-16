import {firebaseFirestore, COLLECTIONS} from '../config/firebase';

const firestore = firebaseFirestore();

/**
 * Club Service
 * Handles all club-related operations
 */
class ClubService {
  // Get all clubs
  async getAllClubs() {
    try {
      const clubsSnapshot = await firestore()
        .collection(COLLECTIONS.CLUBS)
        .orderBy('name')
        .get();

      const clubs = clubsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {success: true, data: clubs};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get club by ID
  async getClubById(clubId) {
    try {
      const clubDoc = await firestore()
        .collection(COLLECTIONS.CLUBS)
        .doc(clubId)
        .get();

      if (clubDoc.exists) {
        return {success: true, data: {id: clubDoc.id, ...clubDoc.data()}};
      }
      return {success: false, error: 'Club not found'};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Create new club (Admin only)
  async createClub(clubData, adminUserId) {
    try {
      const clubRef = await firestore()
        .collection(COLLECTIONS.CLUBS)
        .add({
          name: clubData.name,
          description: clubData.description,
          category: clubData.category || '',
          adminId: adminUserId,
          memberCount: 0,
          imageUrl: clubData.imageUrl || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return {success: true, clubId: clubRef.id};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Update club (Admin only)
  async updateClub(clubId, updates) {
    try {
      await firestore()
        .collection(COLLECTIONS.CLUBS)
        .doc(clubId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Delete club (Admin only)
  async deleteClub(clubId) {
    try {
      await firestore().collection(COLLECTIONS.CLUBS).doc(clubId).delete();
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Join club
  async joinClub(clubId, userId) {
    try {
      // Check if already a member
      const membershipDoc = await firestore()
        .collection(COLLECTIONS.MEMBERSHIPS)
        .where('clubId', '==', clubId)
        .where('userId', '==', userId)
        .get();

      if (!membershipDoc.empty) {
        return {success: false, error: 'Already a member of this club'};
      }

      // Add membership
      await firestore().collection(COLLECTIONS.MEMBERSHIPS).add({
        clubId: clubId,
        userId: userId,
        joinedAt: firestore.FieldValue.serverTimestamp(),
        status: 'active',
      });

      // Increment member count
      await firestore()
        .collection(COLLECTIONS.CLUBS)
        .doc(clubId)
        .update({
          memberCount: firestore.FieldValue.increment(1),
        });

      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Leave club
  async leaveClub(clubId, userId) {
    try {
      const membershipSnapshot = await firestore()
        .collection(COLLECTIONS.MEMBERSHIPS)
        .where('clubId', '==', clubId)
        .where('userId', '==', userId)
        .get();

      if (membershipSnapshot.empty) {
        return {success: false, error: 'Not a member of this club'};
      }

      // Delete membership
      await membershipSnapshot.docs[0].ref.delete();

      // Decrement member count
      await firestore()
        .collection(COLLECTIONS.CLUBS)
        .doc(clubId)
        .update({
          memberCount: firestore.FieldValue.increment(-1),
        });

      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get user's clubs
  async getUserClubs(userId) {
    try {
      const membershipsSnapshot = await firestore()
        .collection(COLLECTIONS.MEMBERSHIPS)
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .get();

      const clubIds = membershipsSnapshot.docs.map(doc => doc.data().clubId);

      if (clubIds.length === 0) {
        return {success: true, data: []};
      }

      const clubsPromises = clubIds.map(clubId =>
        firestore().collection(COLLECTIONS.CLUBS).doc(clubId).get(),
      );

      const clubsDocs = await Promise.all(clubsPromises);
      const clubs = clubsDocs
        .filter(doc => doc.exists)
        .map(doc => ({id: doc.id, ...doc.data()}));

      return {success: true, data: clubs};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get club members
  async getClubMembers(clubId) {
    try {
      const membershipsSnapshot = await firestore()
        .collection(COLLECTIONS.MEMBERSHIPS)
        .where('clubId', '==', clubId)
        .where('status', '==', 'active')
        .get();

      const userIds = membershipsSnapshot.docs.map(doc => doc.data().userId);

      if (userIds.length === 0) {
        return {success: true, data: []};
      }

      const usersPromises = userIds.map(userId =>
        firestore().collection(COLLECTIONS.USERS).doc(userId).get(),
      );

      const usersDocs = await Promise.all(usersPromises);
      const members = usersDocs
        .filter(doc => doc.exists)
        .map(doc => ({id: doc.id, ...doc.data()}));

      return {success: true, data: members};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }
}

export default new ClubService();
