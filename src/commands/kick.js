import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkAdmin } from '../permissions.js';
import { getRobloxUserId, kickUser } from '../roblox.js';
import { addKick, addLog } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a Roblox user from the game')
  .addStringOption(opt => opt.setName('robloxuser').setDescription('Roblox username').setRequired(true))
  .addStringOption(opt => opt.setName('reason').setDescription('Reason for kick').setRequired(true));

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

    await kickUser(userId, reason);
    addKick(username, reason, interaction.user.tag);
    addLog('KICK', username, interaction.user.tag, reason);

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setTitle('User Kicked')
      .addFields(
        { name: 'Roblox User', value: username, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Kicked By', value: interaction.user.tag, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to kick user: ${err.message}`);
  }
}
