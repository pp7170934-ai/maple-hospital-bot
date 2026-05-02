const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData, saveData, addLog } = require('../utils/storage');
const { isAdmin, isHiddenUser } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a Roblox user from the game')
    .addStringOption(o => o.setName('robloxuser').setDescription('Roblox username').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the ban').setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const robloxUser = interaction.options.getString('robloxuser');
    const reason = interaction.options.getString('reason');

    if (isHiddenUser(robloxUser)) {
      return interaction.reply({ content: 'Unable to perform this action on that user.', ephemeral: true });
    }

    const data = getData();

    const alreadyBanned = data.bans.some(b => b.robloxUser.toLowerCase() === robloxUser.toLowerCase());
    if (alreadyBanned) {
      return interaction.reply({ content: `**${robloxUser}** is already banned.`, ephemeral: true });
    }

    data.bans.push({
      robloxUser,
      reason,
      issuedBy: interaction.user.tag,
      discordId: interaction.user.id,
      timestamp: new Date().toISOString()
    });
    saveData(data);

    addLog({
      action: 'BAN',
      target: robloxUser,
      reason,
      by: interaction.user.tag,
      discordId: interaction.user.id
    });

    const embed = new EmbedBuilder()
      .setTitle('🔨 User Banned')
      .setColor(0xFF0000)
      .addFields(
        { name: 'Roblox User', value: robloxUser, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Issued By', value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
