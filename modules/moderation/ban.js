const { SlashCommandBuilder } = require('discord.js');

async function banUser(member, reason) {
  try {
    await member.ban({ reason });
    console.log(`Banned user ${member.user.tag}`);
  } catch (error) {
    console.error('Error occurred while banning user:', error);
  }
}

function init(client, guildId, moderatorRoleId) {
  client.on('ready', () => {
    console.log('ban command initializing');

    const banCommand = new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Bans a user.')
      .addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true))
      .addStringOption((option) => option.setName('reason').setDescription('Reason for banning').setRequired(true));

    // Register the /ban command
    client.guilds.cache
      .get(guildId)
      .commands.create(banCommand)
      .then(() => console.log('Registered slash command: ban'))
      .catch(console.error);

    console.log('ban command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ban') {
      if (!interaction.member.roles.cache.has(moderatorRoleId)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: false });
      }

      const user = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(user.id);
      const reason = interaction.options.getString('reason');

      if (!member) {
        return interaction.reply({ content: 'User not found.', ephemeral: false });
      }

      banUser(member, reason);

      interaction.reply({ content: `${member.user.tag} has been banned! Reason: ${reason}`, ephemeral: false });
    }
  });
}

module.exports = {
  init,
  banUser,
};