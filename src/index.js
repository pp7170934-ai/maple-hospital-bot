import 'dotenv/config';
import { createServer } from 'http';
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import * as ban from './commands/ban.js';
import * as kick from './commands/kick.js';
import * as warn from './commands/warn.js';
import * as assign from './commands/assign.js';
import * as admin from './commands/admin.js';
import * as owner from './commands/owner.js';
import * as moderation from './commands/moderation.js';
import * as logs from './commands/logs.js';

// Validate required env vars up front
const REQUIRED = ['DISCORD_BOT_TOKEN', 'DISCORD_CLIENT_ID', 'DISCORD_GUILD_ID', 'ROBLOX_API_KEY'];
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('MISSING ENVIRONMENT VARIABLES:', missing.join(', '));
  console.error('Please add these in Render > Environment before the bot can work.');
  process.exit(1);
}

console.log('ENV CHECK OK — all required variables are set.');
console.log('DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
console.log('DISCORD_GUILD_ID:', process.env.DISCORD_GUILD_ID);

// Keep-alive HTTP server for Render Web Service free tier
const PORT = process.env.PORT || 3000;
createServer((req, res) => {
  res.writeHead(200);
  res.end('Maple Hospital Bot is running.');
}).listen(PORT, () => {
  console.log(`Health check server listening on port ${PORT}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

const commands = [ban, kick, warn, assign, admin, owner, moderation, logs];
for (const cmd of commands) {
  client.commands.set(cmd.data.name, cmd);
}

client.once('ready', async () => {
  console.log(`Bot is online as ${client.user.tag} (ID: ${client.user.id})`);

  try {
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
    const commandData = commands.map(c => c.data.toJSON());
    console.log(`Registering ${commandData.length} slash commands to guild ${process.env.DISCORD_GUILD_ID}...`);
    const result = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commandData }
    );
    console.log(`Successfully registered ${result.length} slash commands: ${result.map(c => '/' + c.name).join(', ')}`);
  } catch (err) {
    console.error('COMMAND REGISTRATION FAILED:', err.message);
    if (err.message.includes('401')) console.error('-> DISCORD_BOT_TOKEN is invalid or expired.');
    if (err.message.includes('403')) console.error('-> Bot does not have permission. Check DISCORD_CLIENT_ID and that the bot is in the server.');
    if (err.message.includes('50035')) console.error('-> DISCORD_CLIENT_ID or DISCORD_GUILD_ID is wrong.');
  }
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
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
  console.error('FAILED TO LOG IN:', err.message);
  console.error('-> Your DISCORD_BOT_TOKEN is likely wrong or invalid.');
  process.exit(1);
});
