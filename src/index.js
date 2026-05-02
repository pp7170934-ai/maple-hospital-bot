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
  console.log(`Maple Hospital Bot is online as ${client.user.tag}`);
  try {
    const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
    const commandData = commands.map(c => c.data.toJSON());
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commandData }
    );
    console.log('Slash commands registered successfully.');
  } catch (err) {
    console.error('Failed to register slash commands:', err);
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

client.login(process.env.DISCORD_BOT_TOKEN);
