const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Load Modules

const autorole = require('./modules/autorole/autorole');
const verbose = require('./modules/verbose/verbose');
const tzSetter = require('./modules/time/tzSetter');
const time = require('./modules/time/time');
const linkfinder = require('./modules/linkfinder/linkfinder');
const moderation = require('./modules/moderation/moderation');
const selfassign = require('./modules/selfassign/selfassign');
const encode = require('./modules/encode/encode');
const decode = require('./modules/decode/decode');
const pcifinder = require('./modules/pcifinder/pcifinder');
const help = require('./modules/help/help');

const interactivecli = require('./modules/interactivecli/interactive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.setMaxListeners(20); // Set the maximum number of listeners to 20

// Set Bot Server Variables

const guildId = process.env.GUID_ID; // Replace this with your server ID
const memberRoleId = process.env.MEMBER_ROLE_ID; // Replace this with "Member" role ID for your server

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}`);
});

// initiate the modules

autorole.init(client, guildId, memberRoleId);
verbose.init(client, guildId);
tzSetter.init(client, guildId);
time.init(client, guildId);
linkfinder.init(client, guildId);
moderation.init(client, guildId);
selfassign.init(client, guildId);
encode.init(client, guildId);
decode.init(client, guildId);
pcifinder.init(client, guildId);
help.init(client, guildId);

interactivecli.init(client);

// Discord Login

client.login(process.env.DISCORD_TOKEN);