const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const linksFile = './modules/link/links.json';

function getLinksData() {
  try {
    const linksData = fs.readFileSync(linksFile, 'utf-8');
    return JSON.parse(linksData);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('links command initializing');

    const linksCommand = new SlashCommandBuilder()
      .setName('links')
      .setDescription('Displays a list of supported links.');

    // Register the /links command
    client.guilds.cache
      .get(guildId)
      .commands.create(linksCommand)
      .then(() => console.log('Registered slash command: links'))
      .catch(console.error);

    console.log('links command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'links') {
      const linksData = getLinksData();

      if (linksData) {
        const linksList = Object.keys(linksData).join(', ');
        await interaction.reply(`Supported links: ${linksList}`);
      } else {
        await interaction.reply('Failed to fetch the links data.');
      }
    }
  });
}

module.exports = {
  init,
};