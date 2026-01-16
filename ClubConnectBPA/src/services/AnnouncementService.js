import {firebaseFirestore, COLLECTIONS} from '../config/firebase';

const firestore = firebaseFirestore();

/**
 * Announcement Service
 * Handles club announcements
 */
class AnnouncementService {
  // Create announcement
  async createAnnouncement(clubId, title, content, creatorId) {
    try {
      const announcementRef = await firestore()
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .add({
          clubId: clubId,
          title: title,
          content: content,
          creatorId: creatorId,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return {success: true, announcementId: announcementRef.id};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get announcements for a club
  async getClubAnnouncements(clubId) {
    try {
      const announcementsSnapshot = await firestore()
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .where('clubId', '==', clubId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const announcements = announcementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {success: true, data: announcements};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Delete announcement
  async deleteAnnouncement(announcementId) {
    try {
      await firestore()
        .collection(COLLECTIONS.ANNOUNCEMENTS)
        .doc(announcementId)
        .delete();
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }
}

export default new AnnouncementService();
