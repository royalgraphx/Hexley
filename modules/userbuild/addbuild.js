const { SlashCommandBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, Events } = require('discord.js');
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
    console.log('addbuild command initializing');

    const addBuildCommand = new SlashCommandBuilder()
      .setName('addbuild')
      .setDescription('Allows a user to add a build to their database.');

    // Register the /addbuild command
    client.guilds.cache
      .get(guildId)
      .commands.create(addBuildCommand)
      .then(() => console.log('Registered slash command: addbuild'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: addbuild', error);
      });

    console.log('addbuild command initialized');
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.commandName === 'addbuild') {
      const userId = interaction.user.id;

      loadUserBuilds();

      const modal = new ModalBuilder()
        .setCustomId('addBuildModal')
        .setTitle('Add Build');

      const nameInput = new TextInputBuilder()
        .setCustomId('nameInput')
        .setLabel('Enter Build Name')
        .setStyle(TextInputStyle.Short);

      const detailsInput = new TextInputBuilder()
        .setCustomId('detailsInput')
        .setLabel('Enter Build Details')
        .setStyle(TextInputStyle.Paragraph);

      modal.addComponents(new ActionRowBuilder().addComponents(nameInput));
      modal.addComponents(new ActionRowBuilder().addComponents(detailsInput));

      await interaction.showModal(modal);

      interaction.followUp({ content: 'Modal displayed. Please enter the build name and details.' });
    } else if (interaction.isModalSubmit()) {
      const userId = interaction.user.id;
      const buildName = interaction.fields.getTextInputValue('nameInput');
      const buildDetails = interaction.fields.getTextInputValue('detailsInput');

      loadUserBuilds();

      userBuilds[userId] = userBuilds[userId] || {};
      userBuilds[userId][buildName] = { details: buildDetails };

      saveUserBuilds();

      await interaction.reply({ content: 'Build added successfully!' }); // Use await here
    }
  });
}

module.exports = {
  init,
};