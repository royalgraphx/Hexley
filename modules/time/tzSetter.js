const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const timeTable = 'modules/time/timeTable.json';
const geonamesUsername = 'royalgraphx'; // Replace with your actual GeoNames username

async function getLatitudeLongitude(location) {
  try {
    const response = await axios.get('http://api.geonames.org/searchJSON', {
      params: {
        username: geonamesUsername,
        q: location,
        style: 'full',
      },
    });

    const { data } = response;
    if (data.geonames && data.geonames.length > 0) {
      const { lat, lng } = data.geonames[0];
      return { lat, lng };
    }
  } catch (error) {
    console.error(error);
  }

  return null;
}

function init(client, guildId) {
  client.on('ready', async () => {
    console.log('tzSetter command initializing');

    const settzCommand = new SlashCommandBuilder()
      .setName('settz')
      .setDescription('Sets your current timezone.')
      .addStringOption(option =>
        option.setName('location')
          .setDescription('City, County, State')
          .setRequired(true)
      );

    // Register the /settz command
    await client.guilds.cache
      .get(guildId)
      .commands.create(settzCommand)
      .then(() => console.log('Registered slash command: settz'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: settz', error);
      });

    // Add /settf command
    const settfCommand = new SlashCommandBuilder()
      .setName('settf')
      .setDescription('Sets the time format.')
      .addStringOption(option =>
        option.setName('format')
          .setDescription('Time format: 12 or 24')
          .setRequired(true)
      );

    // Register the /settf command
    await client.guilds.cache
      .get(guildId)
      .commands.create(settfCommand)
      .then(() => console.log('Registered slash command: settf'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: settf', error);
      });

    console.log('tzSetter command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'settz') {
      const location = interaction.options.getString('location');

      // Retrieve latitude and longitude from GeoNames API search
      const { lat, lng } = await getLatitudeLongitude(location);

      if (lat && lng) {
        // Check if user already has an entry in timeTable.json
        const existingData = fs.existsSync(timeTable) ? JSON.parse(fs.readFileSync(timeTable, 'utf8')) : [];
        const userDataIndex = existingData.findIndex(userData => userData.user === interaction.user.id);

        if (userDataIndex !== -1) {
          // Update existing user entry with new latitude and longitude
          existingData[userDataIndex].location = location;
          existingData[userDataIndex].latitude = lat;
          existingData[userDataIndex].longitude = lng;
        } else {
          // Add new user entry
          existingData.push({
            user: interaction.user.id,
            location,
            latitude: lat,
            longitude: lng,
            format: '12', // Set default format to 12-hour
          });
        }

        // Save userData to timeTable.json
        fs.writeFileSync(timeTable, JSON.stringify(existingData, null, 2));

        await interaction.reply(`Time zone set for ${location}`);
      } else {
        await interaction.reply('No matching location found for the specified query.');
      }
    }

    if (interaction.commandName === 'settf') {
      const format = interaction.options.getString('format');

      if (format !== '12' && format !== '24') {
        await interaction.reply('Invalid format. Please choose either "12" or "24".');
        return;
      }

      // Find user data and update format in timeTable.json
      const existingData = fs.existsSync(timeTable) ? JSON.parse(fs.readFileSync(timeTable, 'utf8')) : [];
      const userDataIndex = existingData.findIndex(userData => userData.user === interaction.user.id);

      if (userDataIndex !== -1) {
        existingData[userDataIndex].format = format;
        fs.writeFileSync(timeTable, JSON.stringify(existingData, null, 2));
        await interaction.reply(`Time format set to ${format}-hour.`);
      } else {
        await interaction.reply('User data not found. Please use /settz to set your timezone first.');
      }
    }
  });
}

module.exports = {
  init,
};