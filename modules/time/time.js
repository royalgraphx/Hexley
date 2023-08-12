const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const timeTable = 'modules/time/timeTable.json';

function getTime(user) {
  // Retrieve time zone information from timeTable.json
  const userData = getTimeData(user);

  if (userData) {
    const timeZone = userData.timeZone;

    // Fetch current time using the retrieved time zone
    return axios
      .get('http://api.geonames.org/timezoneJSON', {
        params: {
          username: 'royalgraphx', // Replace with your actual GeoNames username
          lat: userData.latitude,
          lng: userData.longitude,
          style: 'full',
        },
      })
      .then((response) => {
        const { data } = response;
        const currentTime = convertTo12HourFormat(data.time);
        return {
          success: true,
          currentTime,
        };
      })
      .catch((error) => {
        console.error(error);
        return {
          success: false,
          error: 'An error occurred while retrieving the time. Please try again later, or if continued failure re-set time zone using more specific location.',
        };
      });
  } else {
    return {
      success: false,
      error: 'Time zone information not found. User has not set their time zone using the /settz command.',
    };
  }
}

function getTimeData(user) {
  if (fs.existsSync(timeTable)) {
    const data = JSON.parse(fs.readFileSync(timeTable, 'utf8'));
    const userData = data.find((userData) => userData.user === user);
    return userData;
  } else {
    return null;
  }
}

function convertTo12HourFormat(time) {
  const date = new Date(time);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  return formattedTime;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('time command initializing');

    const timeCommand = new SlashCommandBuilder()
      .setName('time')
      .setDescription('Displays the current time for a given user.')
      .addUserOption((option) =>
        option.setName('username').setDescription('The user').setRequired(false) // Set to false to make it optional
      );

    // Register the /time command
    client.guilds.cache
      .get(guildId)
      .commands.create(timeCommand)
      .then(() => console.log('Registered slash command: time'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: time', error);
      });

    console.log('time command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'time') {
      let user;

      // Check if the 'username' option is provided
      if (interaction.options.get('username')) {
        user = interaction.options.getUser('username').id;
      } else {
        // Use the user who issued the command
        user = interaction.user.id;
      }

      const result = await getTime(user);

      if (result.success) {
        await interaction.reply(`Current time for <@${user}> is ${result.currentTime}`);
      } else {
        await interaction.reply(result.error);
      }
    }
  });
}

module.exports = {
  init,
};