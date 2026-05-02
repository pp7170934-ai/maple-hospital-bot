import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { hasHighestRank, checkOwner } from '../permissions.js';
import { addOwner, addLog } from '../database.js';

export const data = new SlashCommandBuilder()
  .setName('owner')
  .setDescription('Manage owners')
  .addSubcommand(sub =>
    sub.setName('add')
      .setDescription('Add a new owner')
      .addStringOption(opt => opt.setName('robloxuser').setDescription('Roblox username').setRequired(true))
      .addUserOption(opt => opt.setName('discorduser').setDescription('Discord user').setRequired(true))
  );

export async function execute(interaction) {
  if (!hasHighestRank(interaction.member) && !checkOwner(interaction.member)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const sub = interaction.options.getSubcommand();

  if (sub === 'add') {
    const robloxUsername = interaction.options.getString('robloxuser');
    const discordUser = interaction.options.getUser('discorduser');

    addOwner(discordUser.id, robloxUsername, interaction.user.tag);
    addLog('OWNER_ADD', robloxUsername, interaction.user.tag, `Discord: ${discordUser.tag}`);

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('Owner Added')
      .addFields(
        { name: 'Discord User', value: discordUser.tag, inline: true },
        { name: 'Roblox Username', value: robloxUsername, inline: true },
        { name: 'Added By', value: interaction.user.tag, inline: true }
      )
      .setDescription('This user now has access to `/admin add`, `/owner add`, `/warn`, `/kick`, `/ban`, `/assign`, `/moderation`, and `/logs`.')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
}
