// Mock Firebase for demo purposes
const mockUser = { uid: 'demo-user', email: 'demo@clubconnect.com', displayName: 'Demo User' };

// Return the auth object directly, not a function
export const firebaseAuth = () => {
  return {
    currentUser: mockUser,
    onAuthStateChanged: (callback) => {
      setTimeout(() => callback(mockUser), 0);
      return () => {};
    },
    signInWithEmailAndPassword: async () => ({ user: mockUser }),
    createUserWithEmailAndPassword: async () => ({ user: mockUser }),
    sendPasswordResetEmail: async () => {},
    signOut: async () => {},
  };
};

export const firebaseFirestore = () => {
  return {
    collection: (name) => ({
      doc: (id) => ({
        get: async () => ({ 
          exists: true, 
          id: id || 'demo-id',
          data: () => ({ 
            name: 'Demo Club',
            description: 'This is a demo club',
            memberCount: 42,
            createdAt: new Date(),
          })
        }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
      where: () => ({
        get: async () => ({ 
          docs: [],
          empty: true,
        }),
      }),
      get: async () => ({ 
        docs: [],
        empty: true,
      }),
      add: async () => ({ id: 'demo-id' }),
    }),
  };
};

export const firebaseStorage = () => {
  return {
    ref: () => ({
      putFile: async () => ({ state: 'success' }),
      getDownloadURL: async () => 'https://via.placeholder.com/150',
    }),
  };
};

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  CLUBS: 'clubs',
  EVENTS: 'events',
  ANNOUNCEMENTS: 'announcements',
  ATTENDANCE: 'attendance',
  MEMBERSHIPS: 'memberships',
};
