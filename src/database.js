import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

const DEFAULT = {
  warnings: [],
  bans: [],
  kicks: [],
  admins: [],
  owners: [],
  logs: [],
};

function load() {
  if (!existsSync(DB_FILE)) return { ...DEFAULT };
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { ...DEFAULT };
  }
}

function save(db) {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function addWarning(robloxUsername, reason, warnedBy) {
  const db = load();
  db.warnings.push({ roblox_username: robloxUsername, reason, warned_by: warnedBy, warned_at: new Date().toISOString() });
  save(db);
}

export function addBan(robloxUsername, reason, bannedBy) {
  const db = load();
  db.bans.push({ roblox_username: robloxUsername, reason, banned_by: bannedBy, banned_at: new Date().toISOString() });
  save(db);
}

export function addKick(robloxUsername, reason, kickedBy) {
  const db = load();
  db.kicks.push({ roblox_username: robloxUsername, reason, kicked_by: kickedBy, kicked_at: new Date().toISOString() });
  save(db);
}

export function getWarnings(robloxUsername) {
  return load().warnings.filter(w => w.roblox_username.toLowerCase() === robloxUsername.toLowerCase()).reverse();
}

export function getAllWarnings() {
  return load().warnings.slice(-50).reverse();
}

export function getAllBans() {
  return load().bans.slice(-50).reverse();
}

export function getAllKicks() {
  return load().kicks.slice(-50).reverse();
}

export function addAdmin(discordUserId, robloxUsername, addedBy) {
  const db = load();
  db.admins = db.admins.filter(a => a.discord_user_id !== discordUserId);
  db.admins.push({ discord_user_id: discordUserId, roblox_username: robloxUsername, added_by: addedBy, added_at: new Date().toISOString() });
  save(db);
}

export function addOwner(discordUserId, robloxUsername, addedBy) {
  const db = load();
  db.owners = db.owners.filter(o => o.discord_user_id !== discordUserId);
  db.owners.push({ discord_user_id: discordUserId, roblox_username: robloxUsername, added_by: addedBy, added_at: new Date().toISOString() });
  save(db);
}

export function isAdmin(discordUserId) {
  return load().admins.some(a => a.discord_user_id === discordUserId);
}

export function isOwner(discordUserId) {
  return load().owners.some(o => o.discord_user_id === discordUserId);
}

export function addLog(action, robloxUsername, discordUser, details) {
  const db = load();
  db.logs.push({ action, roblox_username: robloxUsername, discord_user: discordUser, details, created_at: new Date().toISOString() });
  if (db.logs.length > 500) db.logs = db.logs.slice(-500);
  save(db);
}

export function getLogs() {
  return load().logs.slice(-100).reverse();
}
