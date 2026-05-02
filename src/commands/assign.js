import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkAdmin } from '../permissions.js';
import { getRobloxUserId, assignGameRole } from '../roblox.js';
import { addLog } from '../database.js';

const VALID_ROLES = [
  'Doctor',
  'Nurse',
  'Surgeon',
  'Receptionist',
  'Pharmacist',
  'Security',
  'Visitor',
  'Intern',
  'Head Doctor',
  'Head Nurse',
];

export const data = new SlashCommandBuilder()
  .setName('assign')
  .setDescription('Assign a custom server role to a Roblox user')
  .addStringOption(opt =>
    opt.setName('robloxuser').setDescription('Roblox username').setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName('role')
      .setDescription('Role to assign')
      .setRequired(true)
      .addChoices(
        ...VALID_ROLES.map(r => ({ name: r, value: r }))
      )
  );

export async function execute(interaction) {
  if (!checkAdmin(interaction.member)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const username = interaction.options.getString('robloxuser');
  const roleName = interaction.options.getString('role');
  await interaction.deferReply();

  try {
    const userId = await getRobloxUserId(username);
    if (!userId) {
      return interaction.editReply(`Could not find Roblox user **${username}**.`);
    }

    await assignGameRole(userId, roleName);
    addLog('ASSIGN', username, interaction.user.tag, `Assigned role: ${roleName}`);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('Role Assigned')
      .addFields(
        { name: 'Roblox User', value: username, inline: true },
        { name: 'Role', value: roleName, inline: true },
        { name: 'Assigned By', value: interaction.user.tag, inline: true }
      )
      .setDescription('The role will apply next time the player joins or respawns in a custom server.')
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed to assign role: ${err.message}`);
  }
}
