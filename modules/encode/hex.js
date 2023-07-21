const { SlashCommandBuilder } = require('discord.js');

function toDeviceId(hexValue) {    
  // Remove "0x" prefix and pad it to 8 characters with 0's in front of it    
  hexValue = hexValue.padStart(8, '0');
  
  // Split the hex value into pairs of 2 characters each
  const pairs = hexValue.match(/.{1,2}/g);
  
  // Reverse the pairs
  const reversedHex = pairs.reverse().join('');

  // Convert the reversed hex value to an integer (device ID)
  const deviceId = parseInt(reversedHex, 16);

  return deviceId;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('encodehex command initializing');

    const encodeHexCommand = new SlashCommandBuilder()
      .setName('encodehex')
      .setDescription('Converts device ID to little-endian hex value.')
      .addStringOption((option) => option.setName('0x').setDescription('The 4 alphanumeric device ID (e.g., 15DD)').setRequired(true));

    // Register the /encodehex command
    client.guilds.cache
      .get(guildId)
      .commands.create(encodeHexCommand)
      .then(() => console.log('Registered slash command: encodehex'))
      .catch(console.error);

    console.log('encodehex command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'encodehex') {
      const originalHexValue = interaction.options.getString('0x');

      // Check if hexValue is a valid 4-character alphanumeric string
      let hexValue = originalHexValue.replace("0x", "")
      if (hexValue.length % 2 !== 0){
        hexValue = "0"+hexValue
      }
      if (!/^[0-9A-Fa-f]{4}$/.test(hexValue)) {
        await interaction.reply('Invalid device ID. Please provide a valid 4-character alphanumeric string.');
        return;
      }

      const deviceId = toDeviceId(hexValue);

      // Convert deviceId to hex and pad it to 8 characters
      const littleEndianHex = deviceId.toString(16).toUpperCase().padStart(8, '0');

      // Now, split the littleEndianHex into pairs of 2 characters each and join them with a space
      const formattedHex = littleEndianHex.match(/.{1,2}/g).join('');

      await interaction.reply(`Device ID for 0x${originalHexValue} is ${formattedHex}`);
    }
  });
}

module.exports = {
  init,
};