const { SlashCommandBuilder } = require('discord.js');

const versionNumber = '1.1.1';

// Function to get the version number
function getVersion() {
  return versionNumber;
}

// Function to handle the /version command
async function handleVersion(interaction) {
  const versionMessage = `Bot version: ${getVersion()}`;
  await interaction.reply(versionMessage);
}

// Export the base init function
function init(client, guildId) {
  client.on('ready', () => {
    console.log('version command initializing');

    const versionCommand = new SlashCommandBuilder()
      .setName('version')
      .setDescription('Displays the bot version.');

    // Register the /version command
    client.guilds.cache
      .get(guildId)
      .commands.create(versionCommand)
      .then(() => console.log('Registered slash command: version'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: version', error);
      });

    console.log('version command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'version') {
      await handleVersion(interaction);
    }
  });
}

module.exports = {
  init,
  version: getVersion, // Export the version function if needed elsewhere
};