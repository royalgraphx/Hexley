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
      .catch((error) => {
        console.error('Error occurred while registering slash command: help', error);
      });

    console.log('help command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'help') {
      const helpMessage = "List of available commands:\n"
        + "• /help: Displays the available commands for the bot.\n"
        + "• /settz: Allows you to set your current timezone.\n"
        + "• /settf: Allows you to set your time format of choice (12/24hr).\n"
        + "• /time: Displays the time for a given user.\n"
        + "• /link: Quickly link a URL for someone.\n"
        + "• /links: Displays a list of supported links.\n"
        + "• /encodehex: Converts device ID to little-endian hex value.\n"
        + "• /hashsha512: Hashes text using SHA-512.\n"
        + "• /encodebase64: Encodes text to Base64.\n"
        + "• /decodehex: Decodes little-endian hex values into 0x0000 Format.\n"
        + "• /decodebase64: Decodes Base64 to text.\n"
        + "• /pci: Find PCI devices by vendor ID and device ID.\n"
        + "• /usb: Find USB devices by vendor ID and device ID.\n"
        + "• /leaderboard: Displays the Top 10 Leaderboard based on XP.\n"
        + "• /uptime: Displays the bot uptime.\n"
        + "• /build: Can be used to display available builds, as well as details of a build.\n"
        + "• /addbuild: Adds a build to your database.\n"
        + "• /removebuild: Removes a build from your database.\n"
        + "• /updatebuild: Non functional at the moment.\n"
        + "• /version: Displays the current bot version running on prod.\n"
      await interaction.reply(helpMessage);
    }
  });
}

module.exports = {
  init,
};