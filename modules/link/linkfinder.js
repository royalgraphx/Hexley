const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const linksFile = './modules/link/links.json';

function getLinkData(name) {
  try {
    const linksData = fs.readFileSync(linksFile, 'utf-8');
    const links = JSON.parse(linksData);

    const lowercaseName = name.toLowerCase();

    // Perform a partial search for the link name
    for (const linkName in links) {
      if (linkName.toLowerCase().includes(lowercaseName)) {
        return { name: linkName, url: links[linkName] };
      }
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('link command initializing');

    const linkCommand = new SlashCommandBuilder()
      .setName('link')
      .setDescription('Finds and displays the URL for a given link name.')
      .addStringOption(option =>
        option.setName('name')
          .setDescription('The name of the link')
          .setRequired(true)
      );

    // Register the /link command
    client.guilds.cache
      .get(guildId)
      .commands.create(linkCommand)
      .then(() => console.log('Registered slash command: link'))
      .catch(console.error);

    console.log('link command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'link') {
      const name = interaction.options.getString('name');
      const linkData = getLinkData(name);

      if (linkData) {
        const { name: linkName, url: linkURL } = linkData;
        await interaction.reply(`I've found ${linkName}: ${linkURL}`);
      } else {
        await interaction.reply(`Link not found for "${name}".`);
      }
    }
  });
}

module.exports = {
  init,
};