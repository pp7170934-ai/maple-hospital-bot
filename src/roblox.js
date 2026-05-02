import fetch from 'node-fetch';

const API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID;

const DATASTORE_NAME = 'BotRoles';

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

export async function banUser(userId, reason) {
  const res = await fetch(
    `https://apis.roblox.com/cloud/v2/universes/${UNIVERSE_ID}/user-restrictions/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameJoinRestriction: {
          active: true,
          privateReason: reason,
          displayReason: reason,
          excludeAltAccounts: false,
          inherited: false,
        },
      }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roblox ban API error: ${res.status} ${text}`);
  }
  return await res.json();
}

export async function kickUser(userId, reason) {
  const message = JSON.stringify({ userId, reason });
  const res = await fetch(
    `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/BotKick`,
    {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roblox kick API error: ${res.status} ${text}`);
  }
  return true;
}

export async function warnUserInGame(userId, reason) {
  const message = JSON.stringify({ userId, reason });
  const res = await fetch(
    `https://apis.roblox.com/messaging-service/v1/universes/${UNIVERSE_ID}/topics/BotWarn`,
    {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roblox warn API error: ${res.status} ${text}`);
  }
  return true;
}

export async function assignGameRole(userId, roleName) {
  const url = new URL(
    `https://apis.roblox.com/datastores/v1/universes/${UNIVERSE_ID}/standard-datastores/datastore/entries/entry`
  );
  url.searchParams.set('datastoreName', DATASTORE_NAME);
  url.searchParams.set('entryKey', String(userId));

  const body = JSON.stringify(roleName);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
      'content-md5': '',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Roblox DataStore API error: ${res.status} ${text}`);
  }
  return true;
}
