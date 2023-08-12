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

function saveLinksData(linksData) {
  try {
    const jsonData = JSON.stringify(linksData, null, 2);
    fs.writeFileSync(linksFile, jsonData, 'utf-8');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function init(client, guildId, moderatorRoleId) {
  client.on('ready', () => {
    console.log('addlink command initializing');

    const addLinkCommand = new SlashCommandBuilder()
      .setName('addlink')
      .setDescription('Adds a new link to the list.')
      .addStringOption(option =>
        option.setName('name')
          .setDescription('The name of the link')
          .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('url')
          .setDescription('The URL of the link')
          .setRequired(true)
      );

    // Register the /addlink command
    client.guilds.cache
      .get(guildId)
      .commands.create(addLinkCommand)
      .then(() => console.log('Registered slash command: addlink'))
      .catch(console.error);

    console.log('addlink command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'addlink') {
      // Check if the user has the moderator role
      const member = interaction.member;
      if (!member.roles.cache.has(moderatorRoleId)) {
        await interaction.reply('You do not have permission to add links.');
        return;
      }

      // Get the provided link name and URL from the interaction options
      const name = interaction.options.getString('name');
      const url = interaction.options.getString('url');

      // Check if both link name and URL are provided
      if (!name || !url) {
        await interaction.reply('Please provide both the link name and URL.');
        return;
      }

      // Fetch existing links data
      const linksData = getLinksData();

      if (linksData) {
        // Add the new link to the links data object
        linksData[name] = url;

        // Save the updated links data to the file
        const success = saveLinksData(linksData);
        if (success) {
          await interaction.reply(`Successfully added the link: ${name}`);
        } else {
          await interaction.reply('Failed to add the link. Please try again later.');
        }
      } else {
        await interaction.reply('Failed to fetch the links data.');
      }
    }
  });
}

module.exports = {
  init,
};