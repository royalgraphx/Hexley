// mute.js

const { SlashCommandBuilder } = require('discord.js');

async function muteUser(member, mutedRoleId) {
  try {
    await member.roles.add(mutedRoleId);
    console.log(`Muted user ${member.user.tag}`);
  } catch (error) {
    console.error('Error occurred while muting user:', error);
  }
}

function init(client, guildId, moderatorRoleId, mutedRoleId) {
  client.on('ready', () => {
    console.log('mute command initializing');

    const muteCommand = new SlashCommandBuilder()
      .setName('mute')
      .setDescription('Mutes a user.')
      .addUserOption((option) => option.setName('user').setDescription('The user').setRequired(true));

    // Register the /mute command
    client.guilds.cache
      .get(guildId)
      .commands.create(muteCommand)
      .then(() => console.log('Registered slash command: mute'))
      .catch(console.error);

    console.log('mute command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'mute') {
      if (!interaction.member.roles.cache.has(moderatorRoleId)) {
        return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: false });
      }

      const user = interaction.options.getUser('user');
      const member = interaction.guild.members.cache.get(user.id);

      if (!member) {
        return interaction.reply({ content: 'User not found.', ephemeral: false });
      }

      muteUser(member, mutedRoleId);

      interaction.reply({ content: `Muted user ${member.user.tag}`, ephemeral: false });
    }
  });
}

module.exports = {
  init,
  muteUser,
};