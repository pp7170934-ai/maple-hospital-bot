import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkOwner } from '../permissions.js';
import { getLogs } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('logs')
  .setDescription('View all bot action logs (owners only)');

export async function execute(interaction) {
  if (!checkOwner(interaction.member)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const logs = getLogs();

  if (!logs.length) {
    return interaction.reply({ content: 'No logs on record yet.', ephemeral: true });
  }

  const formatDate = dt => new Date(dt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const actionEmoji = {
    BAN: '🔨', KICK: '👢', WARN: '⚠️', ASSIGN: '🎭',
    ADMIN_ADD: '🛡️', OWNER_ADD: '👑',
  };

  const chunks = [];
  let current = '';

  for (const log of logs.slice(0, 30)) {
    const emoji = actionEmoji[log.action] || '📋';
    const line = `${emoji} **${log.action}** — ${log.roblox_username || 'N/A'} by ${log.discord_user} *(${formatDate(log.created_at)})*\n`;
    if (current.length + line.length > 1000) {
      chunks.push(current);
      current = line;
    } else {
      current += line;
    }
  }
  if (current) chunks.push(current);

  const embeds = chunks.map((chunk, i) =>
    new EmbedBuilder()
      .setColor(0x95a5a6)
      .setTitle(i === 0 ? 'Maple Hospital — Action Logs' : '\u200b')
      .setDescription(chunk)
      .setFooter(i === chunks.length - 1 ? { text: `Showing last ${Math.min(logs.length, 30)} of ${logs.length} entries` } : null)
      .setTimestamp(i === chunks.length - 1 ? new Date() : null)
  );

  await interaction.reply({ embeds, ephemeral: true });
}
