import Database from 'better-sqlite3';
import path from 'path';

// Database file path
const dbPath = path.join(process.cwd(), 'data', 'chronos.db');

// Initialize database
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
export function initializeDatabase() {
    // Users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firebase_uid TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT,
      photo_url TEXT,
      has_completed_questionnaire BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Profiles table
    db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      bio TEXT,
      birth_date DATE,
      location TEXT,
      website TEXT,
      linkedin_url TEXT,
      github_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

    // Timelines table
    db.exec(`
    CREATE TABLE IF NOT EXISTS timelines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      is_public BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

    // Milestones table
    db.exec(`
    CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeline_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      image_url TEXT,
      category TEXT,
      tags TEXT, -- JSON array of tags
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (timeline_id) REFERENCES timelines (id) ON DELETE CASCADE
    )
  `);

    // Goals table
    db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_date DATE,
      status TEXT DEFAULT 'active', -- active, completed, paused, cancelled
      priority TEXT DEFAULT 'medium', -- low, medium, high
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

    // Communities table
    db.exec(`
    CREATE TABLE IF NOT EXISTS communities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_by INTEGER NOT NULL,
      is_public BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

    // User communities (many-to-many relationship)
    db.exec(`
    CREATE TABLE IF NOT EXISTS user_communities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      community_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member', -- member, admin, moderator
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (community_id) REFERENCES communities (id) ON DELETE CASCADE,
      UNIQUE(user_id, community_id)
    )
  `);

    // Create indexes for better performance
    db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
    CREATE INDEX IF NOT EXISTS idx_timelines_user_id ON timelines(user_id);
    CREATE INDEX IF NOT EXISTS idx_milestones_timeline_id ON milestones(timeline_id);
    CREATE INDEX IF NOT EXISTS idx_milestones_date ON milestones(date);
    CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
    CREATE INDEX IF NOT EXISTS idx_user_communities_user_id ON user_communities(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_communities_community_id ON user_communities(community_id);
  `);

    console.log('Database initialized successfully');
}

// Initialize database when module is imported
initializeDatabase();

// Database service functions
export const dbService = {
    // User operations
    createUser: (firebaseUid: string, email: string, displayName?: string, photoUrl?: string) => {
        const stmt = db.prepare(`
      INSERT INTO users (firebase_uid, email, display_name, photo_url)
      VALUES (?, ?, ?, ?)
    `);
        return stmt.run(firebaseUid, email, displayName, photoUrl);
    },

    getUserByFirebaseUid: (firebaseUid: string) => {
        const stmt = db.prepare('SELECT * FROM users WHERE firebase_uid = ?');
        return stmt.get(firebaseUid);
    },

    updateUser: (firebaseUid: string, displayName?: string, photoUrl?: string) => {
        const stmt = db.prepare(`
      UPDATE users 
      SET display_name = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE firebase_uid = ?
    `);
        return stmt.run(displayName, photoUrl, firebaseUid);
    },

    // Profile operations
    createProfile: (userId: number, bio?: string, birthDate?: string, location?: string) => {
        const stmt = db.prepare(`
      INSERT INTO profiles (user_id, bio, birth_date, location)
      VALUES (?, ?, ?, ?)
    `);
        return stmt.run(userId, bio, birthDate, location);
    },

    getProfileByUserId: (userId: number) => {
        const stmt = db.prepare('SELECT * FROM profiles WHERE user_id = ?');
        return stmt.get(userId);
    },

    updateProfile: (userId: number, bio?: string, birthDate?: string, location?: string, website?: string, linkedinUrl?: string, githubUrl?: string) => {
        const stmt = db.prepare(`
      UPDATE profiles 
      SET bio = ?, birth_date = ?, location = ?, website = ?, linkedin_url = ?, github_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);
        return stmt.run(bio, birthDate, location, website, linkedinUrl, githubUrl, userId);
    },

    // Timeline operations
    createTimeline: (userId: number, title: string, description?: string, isPublic: boolean = false) => {
        const stmt = db.prepare(`
      INSERT INTO timelines (user_id, title, description, is_public)
      VALUES (?, ?, ?, ?)
    `);
        return stmt.run(userId, title, description, isPublic);
    },

    getTimelinesByUserId: (userId: number) => {
        const stmt = db.prepare('SELECT * FROM timelines WHERE user_id = ? ORDER BY created_at DESC');
        return stmt.all(userId);
    },

    getPublicTimelines: () => {
        const stmt = db.prepare('SELECT t.*, u.display_name, u.photo_url FROM timelines t JOIN users u ON t.user_id = u.id WHERE t.is_public = TRUE ORDER BY t.created_at DESC');
        return stmt.all();
    },

    // Milestone operations
    createMilestone: (timelineId: number, title: string, date: string, description?: string, imageUrl?: string, category?: string, tags?: string[]) => {
        const stmt = db.prepare(`
      INSERT INTO milestones (timeline_id, title, description, date, image_url, category, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        const tagsJson = tags ? JSON.stringify(tags) : null;
        return stmt.run(timelineId, title, description, date, imageUrl, category, tagsJson);
    },

    getMilestonesByTimelineId: (timelineId: number) => {
        const stmt = db.prepare('SELECT * FROM milestones WHERE timeline_id = ? ORDER BY date ASC');
        return stmt.all(timelineId);
    },

    // Goals operations
    createGoal: (userId: number, title: string, description?: string, targetDate?: string, priority: string = 'medium') => {
        const stmt = db.prepare(`
      INSERT INTO goals (user_id, title, description, target_date, priority)
      VALUES (?, ?, ?, ?, ?)
    `);
        return stmt.run(userId, title, description, targetDate, priority);
    },

    getGoalsByUserId: (userId: number) => {
        const stmt = db.prepare('SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC');
        return stmt.all(userId);
    },

    updateGoalStatus: (goalId: number, status: string) => {
        const stmt = db.prepare('UPDATE goals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        return stmt.run(status, goalId);
    }
};

// Close database connection on process exit
process.on('exit', () => {
    db.close();
});

process.on('SIGINT', () => {
    db.close();
    process.exit(0);
});

export default db;
