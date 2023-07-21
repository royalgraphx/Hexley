const { SlashCommandBuilder } = require('discord.js');

function encodeToBase64(text) {
  // Convert the text to Base64 encoding
  const encodedText = Buffer.from(text).toString('base64');
  return encodedText;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('encodebase64 command initializing');

    const encodeBase64Command = new SlashCommandBuilder()
      .setName('encodebase64')
      .setDescription('Encodes text to Base64.')
      .addStringOption((option) => option.setName('text').setDescription('The text to encode').setRequired(true));

    // Register the /encodebase64 command
    client.guilds.cache
      .get(guildId)
      .commands.create(encodeBase64Command)
      .then(() => console.log('Registered slash command: encodebase64'))
      .catch(console.error);

    console.log('encodebase64 command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'encodebase64') {
      const text = interaction.options.getString('text');

      if (!text) {
        await interaction.reply('Please provide text to encode.');
        return;
      }

      const encodedText = encodeToBase64(text);

      await interaction.reply(`Base64 encoded text: \`${encodedText}\``);
    }
  });
}

module.exports = {
  init,
};