import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import * as ban from './commands/ban.js';
import * as kick from './commands/kick.js';
import * as warn from './commands/warn.js';
import * as assign from './commands/assign.js';
import * as admin from './commands/admin.js';
import * as owner from './commands/owner.js';
import * as moderation from './commands/moderation.js';
import * as logs from './commands/logs.js';

const commands = [ban, kick, warn, assign, admin, owner, moderation, logs].map(c => c.data.toJSON());

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commands }
    );
    console.log('All slash commands registered successfully.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();
