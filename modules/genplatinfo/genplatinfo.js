const { SlashCommandBuilder } = require('discord.js');
const { spawn } = require('child_process');
const fs = require('fs');

function init(client, guildId) {
  client.on('ready', () => {
    console.log('genplatinfo command initializing');

    const genplatinfoCommand = new SlashCommandBuilder()
      .setName('genplatinfo')
      .setDescription('Generate Platform Info for a given Mac model.')
      .addStringOption(option =>
        option.setName('model')
          .setDescription('The Mac model for which to generate Platform Info.')
          .setRequired(true));

    // Register the /genplatinfo command
    client.guilds.cache
      .get(guildId)
      .commands.create(genplatinfoCommand)
      .then(() => console.log('Registered slash command: genplatinfo'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: genplatinfo', error);
      });

    console.log('genplatinfo command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'genplatinfo') {
      const model = interaction.options.getString('model');

      //
      //
      // Construct the macserial command
      // macserial was sourced from OpenCorePkg, the version included in this
      // source code and module, (which can be/is considered independent from Hexley), 
      // is modified to run on ARM CPU's, and has modifications to UserPseudoRandom.c,
      // arc4rand and other small changes for Debian/ARM Support. Most common on VPS's
      // which are a known choice to host discord bots on.
      //
      // if you are on an x86_64 system, please aquire the appropriate x86_64 build
      // or else this module will fail and crash Hexley/Hexley derived bots.
      //
      //

      const macserialCmd = spawn('./modules/genplatinfo/macserial', ['--model', model, '--generate', '--num', '1']);

      let output = '';
      macserialCmd.stdout.on('data', (data) => {
        output += data.toString();
      });

      macserialCmd.on('close', async (code) => {
        if (code === 0) {
          const lines = output.trim().split('\n');
          const [systemSerialNumber, mlb] = lines[0].split(' | ');

          const rom = generateRom();
          const systemUuid = await generateSystemUuid();

          const response = `Generated Platform Info for: ${model}\n\n`
            + `MLB Serial: ${mlb}\n`
            + `ROM: ${rom}\n`
            + `System Serial Number: ${systemSerialNumber}\n`
            + `System UUID: ${systemUuid}`;

          interaction.reply(response);
        } else {
          interaction.reply('An error occurred while generating Platform Info.');
        }
      });
    }
  });
}

// Function to generate ROM
function generateRom() {
  const romPrefixes = loadRomPrefixes();
  let romStr = romPrefixes.length > 0 ? randomChoice(romPrefixes) : '';
  while (romStr.length < 12) {
    romStr += randomHexChar();
  }
  return romStr;
}

// Helper function to load ROM prefixes from prefixes.json
//
// prefixes.json sourced from GenSMBIOS [https://raw.githubusercontent.com/corpnewt/GenSMBIOS/master/Scripts/prefix.json]
// MIT License
// Copyright (c) 2018 CorpNewt
//

function loadRomPrefixes() {
  try {
    const prefixesJson = fs.readFileSync('./modules/genplatinfo/prefixes.json', 'utf-8');
    return JSON.parse(prefixesJson);
  } catch (error) {
    console.error('Error loading ROM prefixes:', error);
    return [];
  }
}

// Helper function to choose a random element from an array
function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate a random hexadecimal character
function randomHexChar() {
  const hexChars = '0123456789ABCDEF';
  return hexChars[Math.floor(Math.random() * hexChars.length)];
}

// Function to generate System UUID
function generateSystemUuid() {
  return new Promise((resolve, reject) => {
    const uuidGenCmd = spawn('uuidgen', ['-t']);

    let systemUuid = '';
    uuidGenCmd.stdout.on('data', (data) => {
      systemUuid = data.toString().trim().toUpperCase();
    });

    uuidGenCmd.on('close', (code) => {
      if (code === 0) {
        resolve(systemUuid);
      } else {
        reject(new Error('Failed to generate System UUID'));
      }
    });
  });
}

module.exports = {
  init,
};