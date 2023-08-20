const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const userBuildsPath = path.join(__dirname, '..', 'userbuild', 'user_builds.json');

// Sample data structure to hold user builds
let userBuilds = {};

function loadUserBuilds() {
  if (fs.existsSync(userBuildsPath)) {
    const rawData = fs.readFileSync(userBuildsPath);
    userBuilds = JSON.parse(rawData);
  }
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('buildviewer command initializing');

    const buildViewerCommand = new SlashCommandBuilder()
      .setName('build')
      .setDescription('View user builds or details of a specific build')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user whose builds you want to view'))
      .addStringOption(option =>
        option
          .setName('name')
          .setDescription('The name of the build'));

    // Register the /build command
    client.guilds.cache
      .get(guildId)
      .commands.create(buildViewerCommand)
      .then(() => console.log('Registered slash command: build'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: build', error);
      });

    console.log('buildviewer command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'build') {
      const userOption = interaction.options.getUser('user');
      const buildNameOption = interaction.options.getString('name');
      const userId = userOption ? userOption.id : interaction.user.id;

      loadUserBuilds();

      if (!userBuilds[userId]) {
        await interaction.reply({ content: 'No builds found for this user.' });
        return;
      }

      if (Object.keys(userBuilds[userId]).length === 0) {
        await interaction.reply({ content: 'No builds found for this user.' });
        return;
      }

      if (!buildNameOption) {
        // No build name specified, list available build names
        const buildNames = Object.keys(userBuilds[userId]);
        await interaction.reply({ content: `Available build names for this user: ${buildNames.join(', ')}` });
      } else {
        const build = userBuilds[userId][buildNameOption];
        if (build) {
          const userName = userOption ? userOption.username : interaction.user.username;
          const buildName = buildNameOption;
          const buildDetails = build.details;
          const message = `# ${userName}'s ${buildName} Build:\n${buildDetails}`;
          await interaction.reply({ content: message });
        } else {
          await interaction.reply({ content: 'Build not found.' });
        }
      }
    }
  });
}

module.exports = {
  init,
};