const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Load Modules

const verbose = require('./modules/verbose/verbose');
const version = require('./modules/version/version');
const interactivecli = require('./modules/interactivecli/interactive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

client.setMaxListeners(30); // Set the maximum number of listeners to 30

// Set Bot Server Variables

const guildId = process.env.GUID_ID; // Replace this with your server ID
const versionNumber = version.version();

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}`);
console.log(`Current version: ${versionNumber}`);
});

// initiate the modules
verbose.init(client, guildId);
version.init(client, guildId);
interactivecli.init(client);

// Discord Login

client.login(process.env.DISCORD_TOKEN);