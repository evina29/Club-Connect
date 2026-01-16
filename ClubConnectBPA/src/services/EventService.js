import {firebaseFirestore, COLLECTIONS} from '../config/firebase';

const firestore = firebaseFirestore();

/**
 * Event Service
 * Handles club events and meetings
 */
class EventService {
  // Create new event
  async createEvent(eventData, clubId, creatorId) {
    try {
      const eventRef = await firestore()
        .collection(COLLECTIONS.EVENTS)
        .add({
          clubId: clubId,
          title: eventData.title,
          description: eventData.description,
          location: eventData.location || '',
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          creatorId: creatorId,
          attendeeCount: 0,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return {success: true, eventId: eventRef.id};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get events for a club
  async getClubEvents(clubId) {
    try {
      const eventsSnapshot = await firestore()
        .collection(COLLECTIONS.EVENTS)
        .where('clubId', '==', clubId)
        .orderBy('startDate', 'desc')
        .get();

      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {success: true, data: events};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get all upcoming events for user's clubs
  async getUpcomingEvents(userId) {
    try {
      // Get user's clubs
      const membershipsSnapshot = await firestore()
        .collection(COLLECTIONS.MEMBERSHIPS)
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .get();

      const clubIds = membershipsSnapshot.docs.map(doc => doc.data().clubId);

      if (clubIds.length === 0) {
        return {success: true, data: []};
      }

      // Get events for these clubs
      const now = new Date();
      const eventsSnapshot = await firestore()
        .collection(COLLECTIONS.EVENTS)
        .where('clubId', 'in', clubIds)
        .where('startDate', '>=', now)
        .orderBy('startDate', 'asc')
        .limit(20)
        .get();

      const events = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {success: true, data: events};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Mark attendance
  async markAttendance(eventId, userId) {
    try {
      // Check if already marked
      const attendanceSnapshot = await firestore()
        .collection(COLLECTIONS.ATTENDANCE)
        .where('eventId', '==', eventId)
        .where('userId', '==', userId)
        .get();

      if (!attendanceSnapshot.empty) {
        return {success: false, error: 'Attendance already marked'};
      }

      // Add attendance record
      await firestore().collection(COLLECTIONS.ATTENDANCE).add({
        eventId: eventId,
        userId: userId,
        markedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Increment attendee count
      await firestore()
        .collection(COLLECTIONS.EVENTS)
        .doc(eventId)
        .update({
          attendeeCount: firestore.FieldValue.increment(1),
        });

      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get user attendance records
  async getUserAttendance(userId) {
    try {
      const attendanceSnapshot = await firestore()
        .collection(COLLECTIONS.ATTENDANCE)
        .where('userId', '==', userId)
        .get();

      const attendance = attendanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {success: true, data: attendance};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Delete event
  async deleteEvent(eventId) {
    try {
      await firestore().collection(COLLECTIONS.EVENTS).doc(eventId).delete();
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }
}

export default new EventService();
