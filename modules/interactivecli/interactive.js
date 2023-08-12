const { exec } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ver = "1.1.0";

// Helper function to send a message to a channel
async function sendMessage(channel, messageContent) {
  try {
    const message = await channel.send(messageContent);
    console.log(`Message sent in ${channel.name} (ID: ${channel.id}): ${message.content}`);
  } catch (error) {
    console.error(`Error sending message - ${error.message}`);
  }
}

// Helper function to handle the 'stop' command
function handleStop(rl, client) {
  console.log('Stopping the bot...');
  rl.close(); // Close the readline interface
  client.destroy(); // Gracefully close the Discord bot connection
  process.exit(0); // Exit the process with a success status code (0)
}

// Helper function to handle the 'stats' command
function handleStats(client) {
  // Calculate bot's uptime
  const uptimeInMs = client.uptime;
  const uptimeInSeconds = Math.floor(uptimeInMs / 1000);
  const uptimeInMinutes = Math.floor(uptimeInSeconds / 60);
  const uptimeInHours = Math.floor(uptimeInMinutes / 60);
  const uptimeInDays = Math.floor(uptimeInHours / 24);

  console.log(`Bot Uptime: ${uptimeInDays} days, ${uptimeInHours % 24} hours, ${uptimeInMinutes % 60} minutes`);
}

// Helper function to display the supported commands or detailed info about a specific command
function displayHelp(commandName) {
  if (!commandName) {
    console.log(`Hexley Interactive CLI, Version ${ver}`);
    console.log('These shell commands are defined internally.  Type "help" to see this list.');
    console.log('Type "help [name]" to find out more about the "[name]" command.');
    console.log('');

    // List all commands
    for (const command of commands) {
      console.log(`${command.name}`);
    }
  } else {
    // Find the specific command
    const command = commands.find((cmd) => cmd.name.startsWith(commandName));

    if (command) {
      console.log(`Command: ${command.name}`);
      console.log(`Description: ${command.description}`);
      console.log(``);
      console.log(`Extended Description:`);
      console.log(`${command.extDescription}`);
    } else {
      console.log(`Command "${commandName}" not found. Type "help" to see the list of available commands.`);
    }
  }
}

// Helper function to handle the 'clear' command
function handleClear() {
  // Clear the console output
  console.clear();
}

// Helper function to handle the 'modules' command
function handleModules() {
  const moduleFolder = './modules/';
  const moduleNames = fs.readdirSync(moduleFolder)
    .filter((file) => fs.lstatSync(`${moduleFolder}${file}`).isDirectory()) // Filter out only directories
    .map((moduleName) => {
      const moduleFiles = fs.readdirSync(`${moduleFolder}${moduleName}`).filter((file) => file.endsWith('.js'));
      return moduleFiles.length > 0 ? moduleName : null; // Only return the folder name if it has JS files
    })
    .filter((moduleName) => moduleName !== null); // Filter out null values

  console.log('Loaded modules:');
  for (const moduleName of moduleNames) {
    console.log(`- ${moduleName}`);
  }
}

// Helper function to get the number of loaded modules
function getNumberOfModules() {
  const moduleFolder = './modules/';
  const moduleNames = fs.readdirSync(moduleFolder)
    .filter((file) => fs.lstatSync(`${moduleFolder}${file}`).isDirectory()) // Filter out only directories
    .map((moduleName) => {
      const moduleFiles = fs.readdirSync(`${moduleFolder}${moduleName}`).filter((file) => file.endsWith('.js'));
      return moduleFiles.length > 0 ? moduleName : null; // Only return the folder name if it has JS files
    })
    .filter((moduleName) => moduleName !== null); // Filter out null values

  return moduleNames.length;
}

// Helper function to handle the 'hexfetch' command
function handleHexFetch(client) {
  const username = os.userInfo().username;
  const hostname = os.hostname();
  const osType = os.type();
  const osRelease = os.release();
  const kernelVersion = os.release();
  const uptime = os.uptime();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const cpuModel = os.cpus()[0].model;
  const cpuCores = os.cpus().length;
  const gpuModel = "Not Available";

  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const days = Math.floor(uptime / (secondsInMinute * minutesInHour * hoursInDay));
  const hours = Math.floor((uptime % (secondsInMinute * minutesInHour * hoursInDay)) / (secondsInMinute * minutesInHour));
  const minutes = Math.floor((uptime % (secondsInMinute * minutesInHour)) / secondsInMinute);

  const memoryGB = 1024 * 1024 * 1024; // Convert bytes to GB
  const totalMemoryGB = (totalMemory / memoryGB).toFixed(2);
  const freeMemoryGB = (freeMemory / memoryGB).toFixed(2);

  const version = require('../version/version');
  const versionNumber = version.version();
  const BOTuptimeInMs = client.uptime;
  const BOTuptimeInSeconds = Math.floor(BOTuptimeInMs / 1000);
  const BOTuptimeInMinutes = Math.floor(BOTuptimeInSeconds / 60);
  const BOTuptimeInHours = Math.floor(BOTuptimeInMinutes / 60);
  const BOTuptimeInDays = Math.floor(BOTuptimeInHours / 24);

  console.log(`             ${chalk.gray('&')}                 ${chalk.redBright(`${username}`)}@${chalk.redBright(`${hostname}`)}`);
  console.log(`             ${chalk.gray('JG')}                ${chalk.white('-'.repeat(username.length + hostname.length + 1))}`);
  console.log(`        ${chalk.gray('BJ& B!?B  YYB')}          ${chalk.redBright(`OS: `)}${chalk.white(`${osType} ${osRelease} ${os.arch()}`)}`);
  console.log(`       ${chalk.gray('G~!B GY?P  P?!B')}         ${chalk.redBright(`Host: `)}${chalk.white(`${osType} ${osRelease} ${os.arch()}`)}`);
  console.log(`       ${chalk.gray('5J&   #!&    5J&')}        ${chalk.redBright(`Kernel: `)}${chalk.white(`${kernelVersion}`)}`);
  console.log(`      ${chalk.gray('&!G    &~G     J7&')}       ${chalk.redBright(`System Uptime: `)}${chalk.white(`${days} days, ${hours} hours, ${minutes} minutes`)}`);
  console.log(`      ${chalk.gray('#^P    &!J     J~#')}       ${chalk.redBright(`Free Memory: `)}${chalk.white(`${freeMemoryGB}GB / ${totalMemoryGB}GB`)}`);
  console.log(`      ${chalk.gray('&J7G    7!   &5!Y')}        ${chalk.redBright(`CPU: `)}${chalk.white(`${cpuModel} (${cpuCores} cores)`)}`);
  console.log(`       ${chalk.gray('&Y7?Y5577Y5J??G')}         ${chalk.redBright(`GPU: `)}${chalk.white(gpuModel)}`);
  console.log(`         ${chalk.gray('&#BGG5!5B#&')}           `);
  console.log(`             ${chalk.gray('B^P')}               ${chalk.redBright(`Hexley `)}${chalk.white(`Version: ${versionNumber}`)}`);
  console.log(`              ${chalk.gray('#~J')}              ${chalk.redBright(`Interactive CLI Version: `)}${chalk.white(`${ver}`)}`);
  console.log(`              ${chalk.gray('&7J')}              ${chalk.redBright(`Bot Uptime: `)}${chalk.white(`${BOTuptimeInDays} days, ${BOTuptimeInHours % 24} hours, ${BOTuptimeInMinutes % 60} minutes`)}`);
  console.log(`               ${chalk.gray('##')}              ${chalk.redBright(`Loaded Modules: `)}${chalk.white(`${getNumberOfModules()}`)}`);
  console.log('');
}

const commands = [
  {
    name: 'say [channel id] [message]',
    description: 'Send a message to a specific channel.',
    extDescription: 'Say allows the user to speak as Hexley in the specified Channel ID given. To fetch the Channel ID you wish to speak in, within Discord right-click the text channel and select Copy Channel ID.',
  },
  {
    name: 'stats',
    description: 'Display statistics or information about the bot.',
    extDescription: 'For viewing the Uptime, and various other statistics of Hexley you can use the "stats" command to fetch the data.',
  },
  {
    name: 'stop',
    description: 'Stop the bot.',
    extDescription: 'Gracefully allows the user to stop the bot and its various processes.',
  },
  {
    name: 'clear',
    description: 'Clear the console.',
    extDescription: 'No Extended Description.',
  },
  {
    name: 'modules',
    description: 'List installed modules.',
    extDescription: 'Displays the currently installed modules that Hexley detects. This does not mean they are active or inactive, simply shows the installed modules found.',
  },
  {
    name: 'hexfetch',
    description: 'Fetch the system and bot information.',
    extDescription: 'A static neofetch fork that displays various information of the host running the bot, and various information about the bot.',
  },
];

module.exports = {
  init: (client) => {
    const shellusername = os.userInfo().username;
    const shellhostname = os.hostname();
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${chalk.redBright(shellusername)}@${chalk.redBright(shellhostname)}:~ Hexley $ `,
    });

    rl.prompt(); // Show the prompt initially

    rl.on('line', async (line) => {
      const input = line.trim();

      // Check if the input is empty or contains only spaces
      if (!input) {
        rl.prompt(); // Show the prompt again if input is blank
        return; // Skip processing further
      }

      if (input.startsWith('say ')) {
        // Handle 'say' command
        const [_, channelId, ...messageParts] = input.split(' ');
        const messageContent = messageParts.join(' ');

        const channel = client.channels.cache.get(channelId);
        if (!channel) {
          console.error(`Channel not found for ID: ${channelId}`);
          return;
        }

        sendMessage(channel, messageContent);
      }

      if (input === 'stop') {
        // Handle 'stop' command
        handleStop(rl, client);
      }

      if (input === 'stats') {
        // Handle 'stats' command
        handleStats(client);
      }

      if (input === 'help') {
        // Handle 'help' command
        displayHelp();
      }

      if (input.startsWith('help ')) {
        // Handle 'help' command with a specific command name
        const commandName = input.split(' ')[1]; // Extract the command name
        displayHelp(commandName);
      }

      if (input === 'clear') {
        // Handle 'clear' command
        handleClear();
      }

      if (input === 'modules') {
        // Handle 'modules' command
        handleModules();
      }

      if (input === 'hexfetch') {
        // Handle 'hexfetch' command
        handleHexFetch(client);
      }

      if (
        !input.startsWith('say ') &&
        input !== 'stop' &&
        input !== 'stats' &&
        input !== 'help' &&
        input !== 'clear' &&
        input !== 'modules' &&
        input !== 'hexfetch' &&
        !input.startsWith('help ')
      ) {
        console.log('Unknown command. Type "help" to see the supported commands.');
      }

      rl.prompt(); // Show the prompt again after processing the line
    });

    console.log('Interactive CLI module: Ready! You can now interact with the terminal.');
  },
};