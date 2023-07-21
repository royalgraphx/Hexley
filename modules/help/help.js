const { SlashCommandBuilder } = require('discord.js');

function init(client, guildId) {
  client.on('ready', () => {
    console.log('help command initializing');

    const helpCommand = new SlashCommandBuilder()
      .setName('help')
      .setDescription('Displays the available commands for the bot.');

    // Register the /help command
    client.guilds.cache
      .get(guildId)
      .commands.create(helpCommand)
      .then(() => console.log('Registered slash command: help'))
      .catch(console.error);

    console.log('help command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'help') {
      const helpMessage = "List of available commands:\n"
        + "• /help: Displays the available commands for the bot.\n"
        + "• /settz: Allows you to set your current timezone.\n"
        + "• /time: Displays the time for a given user.\n"
        + "• /link: Quickly link a URL for someone.\n"
        + "• /encodehex: Converts device ID to little-endian hex value.\n"
        + "• /encodebase64: Encodes text to Base64.\n"
        + "• /decodebase64: Decodes Base64 to text.\n"
        + "• /pci: Find PCI devices by vendor ID and device ID.\n"
        + "More commands here as they're implemented.";

      await interaction.reply(helpMessage);
    }
  });
}

module.exports = {
  init,
};