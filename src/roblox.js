import fetch from 'node-fetch';

const API_KEY = process.env.ROBLOX_API_KEY;
const BASE_URL = 'https://maple-api.marizma.games';

const headers = () => ({
  'X-Api-Key': API_KEY,
  'Content-Type': 'application/json',
  'Accept': '*/*',
});

export async function getRobloxUserId(username) {
  const res = await fetch('https://users.roblox.com/v1/usernames/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
  });
  const data = await res.json();
  if (!data.data || data.data.length === 0) return null;
  return data.data[0].id;
}

export async function banUser(userId) {
  const res = await fetch(`${BASE_URL}/v1/server/banplayer`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ Banned: true, UserId: userId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Ban failed (${res.status})`);
  }
  return data;
}

export async function unbanUser(userId) {
  const res = await fetch(`${BASE_URL}/v1/server/banplayer`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ Banned: false, UserId: userId }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Unban failed (${res.status})`);
  }
  return data;
}

export async function kickUser(userId, reason) {
  const res = await fetch(`${BASE_URL}/v1/server/moderation/kick`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ UserId: userId, ModerationReason: reason }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Kick failed (${res.status})`);
  }
  return data;
}

export async function getServerInfo() {
  const res = await fetch(`${BASE_URL}/v1/server`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(`Failed to get server info (${res.status})`);
  return data.data;
}

export async function getServerPlayers() {
  const res = await fetch(`${BASE_URL}/v1/server/players`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(`Failed to get players (${res.status})`);
  return data.data?.Players || [];
}

export async function getServerBans() {
  const res = await fetch(`${BASE_URL}/v1/server/bans`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(`Failed to get bans (${res.status})`);
  return data.data?.Bans || [];
}

export async function announceMessage(message) {
  const res = await fetch(`${BASE_URL}/v1/server/announce`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Announce failed (${res.status})`);
  }
  return data;
}

export async function setServerBanner(banner) {
  const res = await fetch(`${BASE_URL}/v1/server/setbanner`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ banner }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Set banner failed (${res.status})`);
  }
  return data;
}

export async function updateServerSetting(settings) {
  const res = await fetch(`${BASE_URL}/v1/server/setSetting`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Update setting failed (${res.status})`);
  }
  return data;
}
