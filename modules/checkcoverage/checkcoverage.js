// 
// Copyright (c) 2023 ExtremeXT - https://github.com/ExtremeXT/PyAppleSerialChecker
// Copyright (c) 2023 RoyalGraphX - NodeJS Rewrite, then Hexley compatibility rewrite.
// Copyright (c) 2023 oq-x - Modifications after Hexley rewrite for repairing coverage check.
// Licensed under the GNU Affero General Public License v3.0. 
// See LICENSE for details.
// 

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

async function init(client, guildId) {
  client.on('ready', () => {
    console.log('checkcoverage command initializing');

    const checkCoverageCommand = new SlashCommandBuilder()
      .setName('checkcoverage')
      .setDescription('Check the validity of warranty for a given serial number.')
      .addStringOption(option =>
        option.setName('serialnumber')
          .setDescription('The serial number to check')
          .setRequired(true));

    // Register the /checkcoverage command
    client.guilds.cache
      .get(guildId)
      .commands.create(checkCoverageCommand)
      .then(() => console.log('Registered slash command: checkcoverage'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: checkcoverage', error);
      });

    console.log('checkcoverage command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'checkcoverage') {
      const serialNumber = interaction.options.getString('serialnumber');
      
      await interaction.reply('Loading Captcha...');

      // Get captcha image and base64 data
      const user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15";
      const mainPageResponse = await axios.get('https://checkcoverage.apple.com', {
        headers: {
          'User-Agent': user_agent,
        },
      });
      const auth_token = mainPageResponse.headers['x-apple-auth-token'];

      const captchaResponse = await axios.get('https://checkcoverage.apple.com/api/v1/facade/captcha?type=image', {
        headers: {
          'X-Apple-Auth-Token': auth_token,
          'User-Agent': user_agent,
          'Accept': 'application/json',
        },
      });

      const captcha_binary = captchaResponse.data.binaryValue;
      const captchaBuffer = Buffer.from(captcha_binary, 'base64');

      await interaction.followUp({
        files: [captchaBuffer],
        content: 'Please enter the captcha letters from the image:',
      });

      const filter = m => m.author.id === interaction.user.id;
      const captchaCollector = interaction.channel.createMessageCollector({ filter, time: 10000 });

      captchaCollector.on('collect', async (msg) => {
        const captcha_answer = msg.content;

        // Get serial status
        const coverageData = {
          captchaAnswer: captcha_answer,
          captchaType: 'image',
          serialNumber: serialNumber,
        };

        try {
          const coverageResponse = await axios.post('https://checkcoverage.apple.com/api/v1/facade/coverage', coverageData, {
            headers: {
              'X-Apple-Auth-Token': auth_token,
              'User-Agent': user_agent,
            },
          });

          const responseContent = JSON.stringify(coverageResponse.data);

          if (responseContent.includes("Sign in to update purchase date")) {
            interaction.followUp("❌ Unable to verify purchase date, please regenerate!");
          } else if (responseContent.includes("Your coverage includes the following benefits") || responseContent.includes("Coverage Expired")) {
            interaction.followUp("❌ Fully valid, please regenerate!");
          } else {
            console.log("Unknown error occurred!");
            console.log("Response Content:", responseContent); // Print the response content for debugging
            interaction.followUp("An unknown error occurred. Please try again later.");
          }
        } catch (error) {
          const responseContent = JSON.stringify(error.response.data);
          if (responseContent.includes("Sorry. The code you entered doesn")) {
            interaction.followUp("❌ Captcha is invalid, please try again!");
          } else if (responseContent.includes("Please enter a valid serial number.")) {
            interaction.followUp("✅ Serial is invalid, safe to use!");
          } else if (responseContent.includes("Sign in to update purchase date")) {
            interaction.followUp("❌ Unable to verify purchase date, please regenerate!");
          } else {
            console.error("An error occurred:", error.message);
            interaction.followUp("An error occurred while processing your request. Please try again later.");
          }
        } finally {
          captchaCollector.stop(); // Stop collecting messages
        }
      });

      captchaCollector.on('end', (collected, reason) => {
        if (reason === 'time') {
          interaction.followUp('Captcha input timed out.');
        }
      });
    }
  });
}

module.exports = {
  init,
};