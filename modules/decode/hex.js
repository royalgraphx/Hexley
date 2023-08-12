const { SlashCommandBuilder } = require('discord.js');

function fromDeviceId(deviceId) {
    // Convert the device ID to a hexadecimal string
    const hexValue = deviceId.toString(16).toUpperCase().padStart(8, '0');
  
    // Split the hexadecimal value into pairs of 2 characters each
    const pairs = hexValue.match(/.{1,2}/g);
  
    // Reverse the pairs
    const reversedHex = pairs.reverse().join('');
  
    // Remove leading zeros
    const formattedHex = reversedHex.replace(/^0+/, '');
  
    // Add "0x" prefix to the formattedHex
    const prefixedHex = `0x${formattedHex}`;
  
    return prefixedHex;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('decodehex command initializing');

    const decodeHexCommand = new SlashCommandBuilder()
      .setName('decodehex')
      .setDescription('Converts little-endian hex value to device ID.')
      .addStringOption((option) => option.setName('data').setDescription('The little-endian hex value (e.g., bf730000)').setRequired(true));

    // Register the /decodehex command
    client.guilds.cache
      .get(guildId)
      .commands.create(decodeHexCommand)
      .then(() => console.log('Registered slash command: decodehex'))
      .catch((error) => {
       console.error('Error occurred while registering slash command: decodehex', error);
      });

    console.log('decodehex command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'decodehex') {
      const littleEndianHex = interaction.options.getString('data');

      // Check if littleEndianHex is a valid 8-character hexadecimal string
      if (!/^[0-9A-Fa-f]{8}$/.test(littleEndianHex)) {
        await interaction.reply('Invalid little-endian hex value. Please provide a valid 8-character hex number.');
        return;
      }

      // Convert littleEndianHex to deviceId
      const deviceId = parseInt(littleEndianHex, 16);

      // Convert deviceId to formattedHex
      const formattedHex = fromDeviceId(deviceId);

      await interaction.reply(`Formatted ID for ${littleEndianHex} is ${formattedHex}`);
    }
  });
}

module.exports = {
  init,
};