import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkAdmin } from '../permissions.js';
import { getRobloxUserId, warnUserInGame } from '../roblox.js';
import { addWarning, getWarnings, addLog } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Warn a Roblox user')
  .addStringOption(opt => opt.setName('robloxuser').setDescription('Roblox username').setRequired(true))
  .addStringOption(opt => opt.setName('reason').setDescription('Reason for warning').setRequired(true));

export async function execute(interaction) {
  if (!checkAdmin(interaction.member)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const username = interaction.options.getString('robloxuser');
  const reason = interaction.options.getString('reason');
  await interaction.deferReply();

  try {
    const userId = await getRobloxUserId(username);
    if (!userId) {
      return interaction.editReply(`Could not find Roblox user **${username}**.`);
    }

    addWarning(username, reason, interaction.user.tag);
    addLog('WARN', username, interaction.user.tag, reason);

    try {
      await warnUserInGame(userId, reason);
    } catch {
    }

    const allWarnings = getWarnings(username);

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle('User Warned')
      .addFields(
        { name: 'Roblox User', value: username, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Warned By', value: interaction.user.tag, inline: true },
        { name: 'Total Warnings', value: String(allWarnings.length), inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to warn user: ${err.message}`);
  }
}
