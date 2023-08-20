const { SlashCommandBuilder } = require('discord.js');
const crypto = require('crypto');

function hashWithSHA512(text) {
  // Hash the text using SHA-512
  const hashedText = crypto.createHash('sha512').update(text).digest('hex');
  return hashedText;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('hashsha512 command initializing');

    const hashSHA512Command = new SlashCommandBuilder()
      .setName('hashsha512')
      .setDescription('Hashes text using SHA-512.')
      .addStringOption((option) => option.setName('text').setDescription('The text to hash').setRequired(true));

    // Register the /hashsha512 command
    client.guilds.cache
      .get(guildId)
      .commands.create(hashSHA512Command)
      .then(() => console.log('Registered slash command: hashsha512'))
      .catch(console.error);

    console.log('hashsha512 command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'hashsha512') {
      const text = interaction.options.getString('text');

      if (!text) {
        await interaction.reply('Please provide text to hash.');
        return;
      }

      const hashedText = hashWithSHA512(text);

      await interaction.reply(`SHA-512 hash of the text: \`${hashedText}\``);
    }
  });
}

module.exports = {
  init,
};