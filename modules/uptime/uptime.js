const { SlashCommandBuilder } = require('discord.js');

function getUptime(client) {
  // Calculate the uptime of the client in seconds
  const uptimeInSeconds = Math.floor(client.uptime / 1000);

  // Calculate the days, hours, minutes, and seconds from the uptime in seconds
  const days = Math.floor(uptimeInSeconds / (60 * 60 * 24));
  const hours = Math.floor((uptimeInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
  const seconds = uptimeInSeconds % 60;

  // Format the uptime as a string
  const formattedUptime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  return formattedUptime;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('uptime command initializing');

    const uptimeCommand = new SlashCommandBuilder()
      .setName('uptime')
      .setDescription('Displays the uptime of the bot.');

    // Register the /uptime command
    client.guilds.cache
      .get(guildId)
      .commands.create(uptimeCommand)
      .then(() => console.log('Registered slash command: uptime'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: uptime', error);
      });

    console.log('uptime command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'uptime') {
      const uptime = getUptime(client);
      await interaction.reply(`Bot uptime: ${uptime}`);
    }
  });
}

module.exports = {
  init,
  getUptime, // Export the getUptime function to use it in the API route
};