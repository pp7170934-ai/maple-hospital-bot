require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// ─── MAPLE KEY ────────────────────────────────────────────────────────────────
// Highest rank — silent, never exposed by the bot
const MAPLE_KEY = '1397488831514808341';
// ─────────────────────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// ─── Express keep-alive server ────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => res.send('Maple Hospital Bot — Online'));
app.listen(PORT, () => console.log(`Keep-alive server running on port ${PORT}`));

// Self-ping every 14 minutes to prevent Railway from sleeping the app
function selfPing() {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (!domain) return;
  const url = `https://${domain}`;
  fetch(url)
    .then(r => console.log(`[Self-Ping] ${r.status} — ${new Date().toISOString()}`))
    .catch(e => console.error(`[Self-Ping] Failed: ${e.message}`));
}
setInterval(selfPing, 14 * 60 * 1000);

// ─── Discord Bot ──────────────────────────────────────────────────────────────
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  selfPing();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error in /${interaction.commandName}:`, err);
    const msg = { content: 'An error occurred while running this command.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
