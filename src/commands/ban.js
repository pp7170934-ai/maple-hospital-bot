import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkAdmin } from '../permissions.js';
import { getRobloxUserId, banUser } from '../roblox.js';
import { addBan, addLog } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a Roblox user from the custom server')
  .addStringOption(opt => opt.setName('robloxuser').setDescription('Roblox username').setRequired(true))
  .addStringOption(opt => opt.setName('reason').setDescription('Reason for ban').setRequired(true));

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

    await banUser(userId);
    addBan(username, reason, interaction.user.tag);
    addLog('BAN', username, interaction.user.tag, reason);

    const embed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle('User Banned')
      .addFields(
        { name: 'Roblox User', value: username, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Banned By', value: interaction.user.tag, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to ban user: ${err.message}`);
  }
}
