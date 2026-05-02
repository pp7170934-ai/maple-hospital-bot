const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT = {
  warns: [],
  kicks: [],
  bans: [],
  admins: [],
  owners: [],
  assignments: [],
  logs: []
};

function ensureFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT, null, 2));
}

function getData() {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { ...DEFAULT };
  }
}

function saveData(data) {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function addLog(entry) {
  const data = getData();
  data.logs.push({ ...entry, timestamp: new Date().toISOString() });
  if (data.logs.length > 500) data.logs = data.logs.slice(-500);
  saveData(data);
}

module.exports = { getData, saveData, addLog };
