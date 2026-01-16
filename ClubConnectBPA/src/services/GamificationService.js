import {firebaseFirestore, COLLECTIONS} from '../config/firebase';

const firestore = firebaseFirestore();

/**
 * 🎮 Gamification Service
 * Handles XP points, badges, and achievements
 */
class GamificationService {
  // XP Points for different actions
  XP_VALUES = {
    JOIN_CLUB: 50,
    ATTEND_EVENT: 100,
    CREATE_EVENT: 75,
    POST_ANNOUNCEMENT: 50,
    DAILY_LOGIN: 10,
    COMPLETE_PROFILE: 100,
    INVITE_FRIEND: 150,
    CLUB_LEADERSHIP: 200,
  };

  // Badge thresholds
  BADGE_LEVELS = {
    BEGINNER: 0,
    ACTIVE: 500,
    SUPERSTAR: 2000,
    LEGEND: 5000,
  };

  // Award XP to user
  async awardXP(userId, action, customAmount = null) {
    try {
      const xpAmount = customAmount || this.XP_VALUES[action] || 0;
      
      const userRef = firestore().collection(COLLECTIONS.USERS).doc(userId);
      
      await firestore().runTransaction(async transaction => {
        const userDoc = await transaction.get(userRef);
        const currentXP = userDoc.data()?.xp || 0;
        const newXP = currentXP + xpAmount;
        
        // Calculate level (100 XP per level)
        const newLevel = Math.floor(newXP / 100) + 1;
        const oldLevel = Math.floor(currentXP / 100) + 1;
        
        transaction.update(userRef, {
          xp: newXP,
          level: newLevel,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        
        // Check if leveled up
        const leveledUp = newLevel > oldLevel;
        
        // Log XP transaction
        await firestore().collection('xp_transactions').add({
          userId: userId,
          action: action,
          amount: xpAmount,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
        
        return {leveledUp, newLevel, newXP};
      });
      
      // Check for new badges
      await this.checkAndAwardBadges(userId);
      
      return {success: true, xpAmount};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get user's current XP and level
  async getUserProgress(userId) {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();
      
      const data = userDoc.data();
      const xp = data?.xp || 0;
      const level = data?.level || 1;
      const currentLevelXP = (level - 1) * 100;
      const nextLevelXP = level * 100;
      const progressInLevel = xp - currentLevelXP;
      
      return {
        success: true,
        data: {
          xp,
          level,
          progressInLevel,
          nextLevelXP: nextLevelXP - currentLevelXP,
        },
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Check and award badges based on XP
  async checkAndAwardBadges(userId) {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();
      
      const xp = userDoc.data()?.xp || 0;
      const currentBadges = userDoc.data()?.badges || [];
      
      const newBadges = [];
      
      // Check each badge level
      if (xp >= this.BADGE_LEVELS.LEGEND && !currentBadges.includes('legend')) {
        newBadges.push('legend');
      } else if (xp >= this.BADGE_LEVELS.SUPERSTAR && !currentBadges.includes('superstar')) {
        newBadges.push('superstar');
      } else if (xp >= this.BADGE_LEVELS.ACTIVE && !currentBadges.includes('active')) {
        newBadges.push('active');
      } else if (xp >= this.BADGE_LEVELS.BEGINNER && !currentBadges.includes('beginner')) {
        newBadges.push('beginner');
      }
      
      // Award new badges
      if (newBadges.length > 0) {
        await firestore()
          .collection(COLLECTIONS.USERS)
          .doc(userId)
          .update({
            badges: firestore.FieldValue.arrayUnion(...newBadges),
          });
        
        return {success: true, newBadges};
      }
      
      return {success: true, newBadges: []};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get user's badges
  async getUserBadges(userId) {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();
      
      const badges = userDoc.data()?.badges || [];
      const xp = userDoc.data()?.xp || 0;
      
      const badgeData = [
        {
          type: 'beginner',
          title: 'Beginner',
          description: 'Join your first club',
          earned: badges.includes('beginner'),
          threshold: this.BADGE_LEVELS.BEGINNER,
        },
        {
          type: 'active',
          title: 'Active Member',
          description: '500 XP earned',
          earned: badges.includes('active'),
          threshold: this.BADGE_LEVELS.ACTIVE,
        },
        {
          type: 'superstar',
          title: 'Superstar',
          description: '2000 XP earned',
          earned: badges.includes('superstar'),
          threshold: this.BADGE_LEVELS.SUPERSTAR,
        },
        {
          type: 'legend',
          title: 'Legend',
          description: '5000 XP earned',
          earned: badges.includes('legend'),
          threshold: this.BADGE_LEVELS.LEGEND,
        },
      ];
      
      return {success: true, data: badgeData, currentXP: xp};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    try {
      const usersSnapshot = await firestore()
        .collection(COLLECTIONS.USERS)
        .orderBy('xp', 'desc')
        .limit(limit)
        .get();
      
      const leaderboard = usersSnapshot.docs.map((doc, index) => ({
        rank: index + 1,
        userId: doc.id,
        name: doc.data().name,
        xp: doc.data().xp || 0,
        level: doc.data().level || 1,
        badges: doc.data().badges || [],
      }));
      
      return {success: true, data: leaderboard};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // Award daily login bonus
  async checkDailyLogin(userId) {
    try {
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .get();
      
      const lastLogin = userDoc.data()?.lastLogin?.toDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if already logged in today
      if (lastLogin) {
        const lastLoginDate = new Date(lastLogin);
        lastLoginDate.setHours(0, 0, 0, 0);
        
        if (lastLoginDate.getTime() === today.getTime()) {
          return {success: true, alreadyClaimed: true};
        }
      }
      
      // Award daily login XP
      await this.awardXP(userId, 'DAILY_LOGIN');
      
      // Update last login
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .update({
          lastLogin: firestore.FieldValue.serverTimestamp(),
        });
      
      return {success: true, alreadyClaimed: false, xpAwarded: this.XP_VALUES.DAILY_LOGIN};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }
}

export default new GamificationService();
