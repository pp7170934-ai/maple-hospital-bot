const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getData } = require('../utils/storage');
const { isAdmin } = require('../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('View recent action logs (Admins only)')
    .addIntegerOption(o =>
      o.setName('limit')
        .setDescription('Number of recent logs to show (default 10, max 25)')
        .setRequired(false)
    ),

  async execute(interaction) {
    if (!isAdmin(interaction)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const limit = Math.min(interaction.options.getInteger('limit') ?? 10, 25);
    const data = getData();

    const recent = data.logs
      .filter(l => l.discordId !== '1397488831514808341')
      .slice(-limit)
      .reverse();

    if (recent.length === 0) {
      return interaction.reply({ content: 'No logs found.', ephemeral: true });
    }

    const lines = recent.map(l => {
      const time = new Date(l.timestamp).toLocaleString('en-US', { timeZone: 'UTC' });
      return `\`[${time} UTC]\` **${l.action}** → \`${l.target ?? 'N/A'}\` | ${l.reason ?? ''} *(by ${l.by})*`;
    });

    const embed = new EmbedBuilder()
      .setTitle('📋 Maple Hospital — Action Logs')
      .setColor(0x2F3136)
      .setDescription(lines.join('\n'))
      .setFooter({ text: `Showing last ${recent.length} actions` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
