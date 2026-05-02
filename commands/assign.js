const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData, saveData, addLog } = require('../utils/storage');
const { isAdmin, HIDDEN_ROBLOX } = require('../utils/permissions');

const ROLES = [
  'Community Member',
  'Patient',
  'Nurse',
  'Junior Doctor',
  'Doctor',
  'Senior Doctor',
  'Head of Department',
  'Administrator'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('assign')
    .setDescription('Assign a role to a Roblox user')
    .addStringOption(o => o.setName('robloxuser').setDescription('Roblox username').setRequired(true))
    .addStringOption(o =>
      o.setName('role')
        .setDescription('Role to assign')
        .setRequired(true)
        .addChoices(...ROLES.map(r => ({ name: r, value: r })))
    ),

  async execute(interaction) {
    if (!isAdmin(interaction)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const robloxUser = interaction.options.getString('robloxuser');
    let role = interaction.options.getString('role');

    if (robloxUser.toLowerCase() === HIDDEN_ROBLOX.toLowerCase()) {
      role = 'Owner';
    }

    const data = getData();
    const existing = data.assignments.findIndex(a => a.robloxUser.toLowerCase() === robloxUser.toLowerCase());
    const entry = {
      robloxUser,
      role,
      assignedBy: interaction.user.tag,
      discordId: interaction.user.id,
      timestamp: new Date().toISOString()
    };

    if (existing !== -1) {
      data.assignments[existing] = entry;
    } else {
      data.assignments.push(entry);
    }
    saveData(data);

    addLog({
      action: 'ASSIGN',
      target: robloxUser,
      reason: `Assigned role: ${role}`,
      by: interaction.user.tag,
      discordId: interaction.user.id
    });

    const embed = new EmbedBuilder()
      .setTitle('✅ Role Assigned')
      .setColor(0x00CC99)
      .addFields(
        { name: 'Roblox User', value: robloxUser, inline: true },
        { name: 'Role', value: role, inline: true },
        { name: 'Assigned By', value: interaction.user.tag }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
