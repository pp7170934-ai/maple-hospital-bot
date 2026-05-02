import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '..', 'data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_user_id TEXT NOT NULL UNIQUE,
    roblox_username TEXT NOT NULL,
    added_by TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS owners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_user_id TEXT NOT NULL UNIQUE,
    roblox_username TEXT NOT NULL,
    added_by TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roblox_username TEXT NOT NULL,
    reason TEXT NOT NULL,
    warned_by TEXT NOT NULL,
    warned_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roblox_username TEXT NOT NULL,
    reason TEXT NOT NULL,
    banned_by TEXT NOT NULL,
    banned_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS kicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roblox_username TEXT NOT NULL,
    reason TEXT NOT NULL,
    kicked_by TEXT NOT NULL,
    kicked_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS action_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    roblox_username TEXT,
    discord_user TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export function addWarning(robloxUsername, reason, warnedBy) {
  db.prepare('INSERT INTO warnings (roblox_username, reason, warned_by) VALUES (?, ?, ?)').run(robloxUsername, reason, warnedBy);
}

export function addBan(robloxUsername, reason, bannedBy) {
  db.prepare('INSERT INTO bans (roblox_username, reason, banned_by) VALUES (?, ?, ?)').run(robloxUsername, reason, bannedBy);
}

export function addKick(robloxUsername, reason, kickedBy) {
  db.prepare('INSERT INTO kicks (roblox_username, reason, kicked_by) VALUES (?, ?, ?)').run(robloxUsername, reason, kickedBy);
}

export function getWarnings(robloxUsername) {
  return db.prepare('SELECT * FROM warnings WHERE roblox_username = ? ORDER BY warned_at DESC').all(robloxUsername);
}

export function getAllWarnings() {
  return db.prepare('SELECT * FROM warnings ORDER BY warned_at DESC LIMIT 50').all();
}

export function getAllBans() {
  return db.prepare('SELECT * FROM bans ORDER BY banned_at DESC LIMIT 50').all();
}

export function getAllKicks() {
  return db.prepare('SELECT * FROM kicks ORDER BY kicked_at DESC LIMIT 50').all();
}

export function addAdmin(discordUserId, robloxUsername, addedBy) {
  db.prepare('INSERT OR REPLACE INTO admins (discord_user_id, roblox_username, added_by) VALUES (?, ?, ?)').run(discordUserId, robloxUsername, addedBy);
}

export function addOwner(discordUserId, robloxUsername, addedBy) {
  db.prepare('INSERT OR REPLACE INTO owners (discord_user_id, roblox_username, added_by) VALUES (?, ?, ?)').run(discordUserId, robloxUsername, addedBy);
}

export function isAdmin(discordUserId) {
  return db.prepare('SELECT 1 FROM admins WHERE discord_user_id = ?').get(discordUserId) !== undefined;
}

export function isOwner(discordUserId) {
  return db.prepare('SELECT 1 FROM owners WHERE discord_user_id = ?').get(discordUserId) !== undefined;
}

export function addLog(action, robloxUsername, discordUser, details) {
  db.prepare('INSERT INTO action_logs (action, roblox_username, discord_user, details) VALUES (?, ?, ?, ?)').run(action, robloxUsername, discordUser, details);
}

export function getLogs() {
  return db.prepare('SELECT * FROM action_logs ORDER BY created_at DESC LIMIT 100').all();
}

export default db;
