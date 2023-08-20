const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const userBuildsPath = path.join(__dirname, '..', 'userbuild', 'user_builds.json');

// Sample data structure to hold user builds
let userBuilds = {};

function saveUserBuilds() {
  fs.writeFileSync(userBuildsPath, JSON.stringify(userBuilds, null, 2));
}

function loadUserBuilds() {
  if (fs.existsSync(userBuildsPath)) {
    const rawData = fs.readFileSync(userBuildsPath);
    userBuilds = JSON.parse(rawData);
  }
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('removebuild command initializing');

    const removeBuildCommand = new SlashCommandBuilder()
      .setName('removebuild')
      .setDescription('Remove a build from your database.')
      .addStringOption(option =>
        option
          .setName('name')
          .setDescription('The name of the build to remove')
          .setRequired(true));

    // Register the /removebuild command
    client.guilds.cache
      .get(guildId)
      .commands.create(removeBuildCommand)
      .then(() => console.log('Registered slash command: removebuild'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: removebuild', error);
      });

    console.log('removebuild command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'removebuild') {
      const buildName = interaction.options.getString('name');
      const userId = interaction.user.id;

      loadUserBuilds();

      if (!userBuilds[userId] || !userBuilds[userId][buildName]) {
        await interaction.reply({ content: `Build "${buildName}" not found.` });
        return;
      }

      delete userBuilds[userId][buildName];
      saveUserBuilds();

      await interaction.reply({ content: `Build "${buildName}" has been removed.` });
    }
  });
}

module.exports = {
  init,
};