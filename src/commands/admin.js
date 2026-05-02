import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { checkOwner } from '../permissions.js';
import { addAdmin, addLog } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('admin')
  .setDescription('Manage admins')
  .addSubcommand(sub =>
    sub.setName('add')
      .setDescription('Add a new admin')
      .addStringOption(opt => opt.setName('robloxuser').setDescription('Roblox username').setRequired(true))
      .addUserOption(opt => opt.setName('discorduser').setDescription('Discord user').setRequired(true))
  );

export async function execute(interaction) {
  if (!checkOwner(interaction.member)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const sub = interaction.options.getSubcommand();

  if (sub === 'add') {
    const robloxUsername = interaction.options.getString('robloxuser');
    const discordUser = interaction.options.getUser('discorduser');

    addAdmin(discordUser.id, robloxUsername, interaction.user.tag);
    addLog('ADMIN_ADD', robloxUsername, interaction.user.tag, `Discord: ${discordUser.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle('Admin Added')
      .addFields(
        { name: 'Discord User', value: discordUser.tag, inline: true },
        { name: 'Roblox Username', value: robloxUsername, inline: true },
        { name: 'Added By', value: interaction.user.tag, inline: true }
      )
      .setDescription('This user now has access to `/warn`, `/kick`, `/ban`, and `/assign`.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}
