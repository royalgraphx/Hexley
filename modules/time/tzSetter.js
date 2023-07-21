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
      .catch(console.error);

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
          });
        }

        // Save userData to timeTable.json
        fs.writeFileSync(timeTable, JSON.stringify(existingData, null, 2));

        await interaction.reply(`Time zone set for ${location}`);
      } else {
        await interaction.reply('No matching location found for the specified query.');
      }
    }
  });
}

module.exports = {
  init,
};