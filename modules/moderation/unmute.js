// unmute.js

const { SlashCommandBuilder } = require('discord.js');

async function unmuteUser(member, mutedRoleId) {
  try {
    await member.roles.remove(mutedRoleId);
    console.log(`Unmuted user ${member.user.tag}`);
  } catch (error) {
    console.error('Error occurred while unmuting user:', error);
  }
}

function init(client, guildId, moderatorRoleId, mutedRoleId) {
  client.on('ready', () => {
    console.log('unmute command initializing');

    const unmuteCommand = new SlashCommandBuilder()
      .setName('unmute')
      .setDescription('Unmutes a user.')
      .addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true));

    // Register the /unmute command
    client.guilds.cache
      .get(guildId)
      .commands.create(unmuteCommand)
      .then(() => console.log('Registered slash command: unmute'))
      .catch(console.error);

    console.log('unmute command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'unmute') {
      if (!interaction.member.roles.cache.has(moderatorRoleId)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      }

      const user = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        return interaction.reply({ content: 'User not found.', ephemeral: true });
      }

      unmuteUser(member, mutedRoleId);

      interaction.reply({ content: `Unmuted user ${member.user.tag}`, ephemeral: true });
    }
  });
}

module.exports = {
  init,
  unmuteUser,
};
