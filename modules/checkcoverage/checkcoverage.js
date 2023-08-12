const { SlashCommandBuilder } = require('discord.js');
const puppeteer = require('puppeteer');

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
      let authToken; // Define a variable to store the X-Apple-Auth-Token
      // Send initial response with captcha image
      await interaction.reply('Loading Captcha...');

      let browser;

      try {
        browser = await puppeteer.launch({ headless: 'new', executablePath: '/snap/bin/chromium' });
        const page = await browser.newPage();

         // Capture the response headers
         page.on('response', async (response) => {
          if (response.url() === 'https://checkcoverage.apple.com/') {
            authToken = response.headers()['x-apple-auth-token'];
            console.log('X-Apple-Auth-Token:', authToken); // Log the token for debugging
          }
        });

        await page.goto('https://checkcoverage.apple.com/?locale=en_US', {
          waitUntil: 'networkidle2',
        });

        const captchaImageSelector = 'img[alt="captcha"][class^="Captcha_captcha-image__"]';
        const captchaImageHandle = await page.$(captchaImageSelector);

        if (captchaImageHandle) {
          const base64Data = await captchaImageHandle.screenshot({ encoding: 'base64' });
          const imageBuffer = Buffer.from(base64Data, 'base64');

          await interaction.followUp({
            files: [imageBuffer],
            content: 'Here is the captcha image. Please enter the captcha letters from the image:',
          });

          const reply = await interaction.channel.awaitMessages({
            filter: msg => msg.author.id === interaction.user.id,
            max: 1,
            time: 10000,
            errors: ['time'],
          });

          const captchaAnswer = reply.first().content.trim();
          console.log('Captcha Answer:', captchaAnswer); // Log the captcha answer for debugging

          const postData = {
            serialNumber: serialNumber,
            captchaAnswer: captchaAnswer,
            captchaType: 'image',
          };

          const response = await page.evaluate(async (data, authToken) => {
            const fetchResponse = await fetch('https://checkcoverage.apple.com/api/v1/facade/coverage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Apple-Auth-Token': authToken, // Include the auth token in the headers
              },
              body: JSON.stringify(data),
            });
            return fetchResponse.text();
          }, postData, authToken); // Pass the authToken to the page.evaluate function

          console.log('Response Text:', response); // Log the response

          try {
            const jsonResponse = JSON.parse(response);
            let finalMessage = '';

            if (jsonResponse.errorType === 1 && jsonResponse.errorState === 4) {
              finalMessage = 'Coverage Check for Serial failed, you should be safe using this serial number!';
            } else {
              finalMessage = 'Coverage Check for Serial passed, the serial is not safe for use.';
            }

            await interaction.editReply(finalMessage);
          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            await interaction.followUp('An error occurred while processing the server response.');
          }
        } else {
          await interaction.followUp('Captcha image not found. Please try again later.');
        }
      } catch (error) {
        console.error('Error:', error);
        await interaction.followUp('An error occurred while processing your request.');
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    }
  });
}

module.exports = {
  init,
};