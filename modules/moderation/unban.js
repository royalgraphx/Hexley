const { SlashCommandBuilder } = require('discord.js');

async function unbanUser(guild, user, moderationChannel) {
  try {
    await guild.members.unban(user);
    console.log(`Unbanned user ${user.tag}`);
  } catch (error) {
    console.error('Error occurred while unbanning user:', error);
  }
}

function init(client, guildId, moderatorRoleId, moderationChannel) {
  client.on('ready', () => {
    console.log('unban command initializing');

    const unbanCommand = new SlashCommandBuilder()
      .setName('unban')
      .setDescription('Unbans a user.')
      .addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true));

    // Register the /unban command
    client.guilds.cache
      .get(guildId)
      .commands.create(unbanCommand)
      .then(() => console.log('Registered slash command: unban'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: unban', error);
      });

    console.log('unban command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'unban') {
      if (!interaction.member.roles.cache.has(moderatorRoleId)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: false });
      }

      const user = interaction.options.getUser('user');

      unbanUser(interaction.guild, user);

      interaction.reply({ content: `${user.tag} has been unbanned.`, ephemeral: false });
    }
  });
}

module.exports = {
  init,
  unbanUser,
};