const { SlashCommandBuilder } = require('discord.js');

function decodeFromBase64(encodedText) {
  // Convert the Base64 encoded text to its original form
  const decodedText = Buffer.from(encodedText, 'base64').toString('utf-8');
  return decodedText;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('decodebase64 command initializing');

    const decodeBase64Command = new SlashCommandBuilder()
      .setName('decodebase64')
      .setDescription('Decodes Base64-encoded text.')
      .addStringOption((option) => option.setName('encoded_text').setDescription('The Base64-encoded text to decode').setRequired(true));

    // Register the /decodebase64 command
    client.guilds.cache
      .get(guildId)
      .commands.create(decodeBase64Command)
      .then(() => console.log('Registered slash command: decodebase64'))
      .catch(console.error);

    console.log('decodebase64 command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'decodebase64') {
      const encodedText = interaction.options.getString('encoded_text');

      if (!encodedText) {
        await interaction.reply('Please provide Base64-encoded text to decode.');
        return;
      }

      const decodedText = decodeFromBase64(encodedText);

      await interaction.reply(`Decoded text: \`${decodedText}\``);
    }
  });
}

module.exports = {
  init,
};