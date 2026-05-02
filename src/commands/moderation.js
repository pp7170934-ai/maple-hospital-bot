import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkAdmin } from '../permissions.js';
import { getAllWarnings, getAllBans, getAllKicks } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('moderation')
  .setDescription('View recent moderation actions (warns, kicks, bans)');

export async function execute(interaction) {
  if (!checkAdmin(interaction.member)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const warnings = getAllWarnings();
  const bans = getAllBans();
  const kicks = getAllKicks();

  const formatDate = dt => new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const warnText = warnings.length
    ? warnings.slice(0, 10).map(w => `• **${w.roblox_username}** — ${w.reason} *(${formatDate(w.warned_at)})*`).join('\n')
    : 'No warnings on record.';

  const kickText = kicks.length
    ? kicks.slice(0, 10).map(k => `• **${k.roblox_username}** — ${k.reason} *(${formatDate(k.kicked_at)})*`).join('\n')
    : 'No kicks on record.';

  const banText = bans.length
    ? bans.slice(0, 10).map(b => `• **${b.roblox_username}** — ${b.reason} *(${formatDate(b.banned_at)})*`).join('\n')
    : 'No bans on record.';

  const embed = new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle('Maple Hospital — Moderation Log')
    .addFields(
      { name: `⚠️ Recent Warnings (${warnings.length} total)`, value: warnText },
      { name: `👢 Recent Kicks (${kicks.length} total)`, value: kickText },
      { name: `🔨 Recent Bans (${bans.length} total)`, value: banText }
    )
    .setFooter({ text: 'Showing last 10 of each category' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
