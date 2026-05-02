const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData, saveData, addLog } = require('../utils/storage');
const { isServerOwner, isHiddenUser } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin-add')
    .setDescription('Add an admin (Server Owner only)')
    .addStringOption(o => o.setName('robloxuser').setDescription('Roblox username').setRequired(true))
    .addStringOption(o => o.setName('discordid').setDescription('Discord User ID').setRequired(true)),

  async execute(interaction) {
    if (!isServerOwner(interaction)) {
      return interaction.reply({ content: 'Only the server owner can use this command.', ephemeral: true });
    }

    const robloxUser = interaction.options.getString('robloxuser');
    const discordId = interaction.options.getString('discordid');

    if (isHiddenUser(robloxUser, discordId)) {
      return interaction.reply({ content: 'Unable to perform this action.', ephemeral: true });
    }

    const data = getData();
    const already = data.admins.some(a => a.discordId === discordId);
    if (already) {
      return interaction.reply({ content: `That user is already an admin.`, ephemeral: true });
    }

    data.admins.push({
      robloxUser,
      discordId,
      addedBy: interaction.user.tag,
      timestamp: new Date().toISOString()
    });
    saveData(data);

    addLog({
      action: 'ADMIN-ADD',
      target: robloxUser,
      reason: `Discord ID: ${discordId}`,
      by: interaction.user.tag,
      discordId: interaction.user.id
    });

    const embed = new EmbedBuilder()
      .setTitle('🛡️ Admin Added')
      .setColor(0x5865F2)
      .addFields(
        { name: 'Roblox User', value: robloxUser, inline: true },
        { name: 'Discord ID', value: discordId, inline: true },
        { name: 'Added By', value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
