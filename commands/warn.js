const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData, saveData, addLog } = require('../utils/storage');
const { isAdmin } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a Roblox user')
    .addStringOption(o => o.setName('robloxuser').setDescription('Roblox username').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for the warning').setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const robloxUser = interaction.options.getString('robloxuser');
    const reason = interaction.options.getString('reason');

    const data = getData();
    const entry = {
      robloxUser,
      reason,
      issuedBy: interaction.user.tag,
      discordId: interaction.user.id,
      timestamp: new Date().toISOString()
    };
    data.warns.push(entry);
    saveData(data);

    addLog({
      action: 'WARN',
      target: robloxUser,
      reason,
      by: interaction.user.tag,
      discordId: interaction.user.id
    });

    const totalWarns = data.warns.filter(w => w.robloxUser.toLowerCase() === robloxUser.toLowerCase()).length;

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Warning Issued')
      .setColor(0xFFCC00)
      .addFields(
        { name: 'Roblox User', value: robloxUser, inline: true },
        { name: 'Total Warns', value: `${totalWarns}`, inline: true },
        { name: 'Reason', value: reason },
        { name: 'Issued By', value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
