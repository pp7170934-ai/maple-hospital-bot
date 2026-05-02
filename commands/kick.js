const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData, saveData, addLog } = require('../utils/storage');
const { isAdmin } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a Roblox user from the game')
    .addStringOption(o => o.setName('robloxuser').setDescription('Roblox username').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the kick').setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const robloxUser = interaction.options.getString('robloxuser');
    const reason = interaction.options.getString('reason');

    const data = getData();
    data.kicks.push({
      robloxUser,
      reason,
      issuedBy: interaction.user.tag,
      discordId: interaction.user.id,
      timestamp: new Date().toISOString()
    });
    saveData(data);

    addLog({
      action: 'KICK',
      target: robloxUser,
      reason,
      by: interaction.user.tag,
      discordId: interaction.user.id
    });

    const embed = new EmbedBuilder()
      .setTitle('👢 User Kicked')
      .setColor(0xFF8C00)
      .addFields(
        { name: 'Roblox User', value: robloxUser, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Issued By', value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
