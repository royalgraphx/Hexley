const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

// Load environment variables from .env file
dotenv.config();

// Import the webPanel module
const webPanel = require('./modules/web/web');

// Load Modules
// const deregister = require('./modules/deregister/deregister');

const autorole = require('./modules/autorole/autorole');
const verbose = require('./modules/verbose/verbose');
const version = require('./modules/version/version');
const tzSetter = require('./modules/time/tzSetter');
const time = require('./modules/time/time');
const linkfinder = require('./modules/link/linkfinder');
const linklister = require('./modules/link/linklister');
const linkadder = require('./modules/link/linkadder');
const moderation = require('./modules/moderation/moderation');
const selfassign = require('./modules/selfassign/selfassign');
const hash = require('./modules/hash/hash');
const encode = require('./modules/encode/encode');
const decode = require('./modules/decode/decode');
const pcifinder = require('./modules/pcifinder/pcifinder');
const usbfinder = require('./modules/usbfinder/usbfinder');
const help = require('./modules/help/help');
const rp = require('./modules/customrp/rp');
const uptime = require('./modules/uptime/uptime');
const xpSystem = require('./modules/xpSystem/xpSystem');
const genplatinfo = require('./modules/genplatinfo/genplatinfo');
const checkcoverage = require('./modules/checkcoverage/checkcoverage');
const vulgarityfilter = require('./modules/moderation/vulgarityfilter.js');
const messageRateLimit = require('./modules/moderation/messagerl');
const userBuildModule = require('./modules/userbuild/module');

const interactivecli = require('./modules/interactivecli/interactive');

const modApi = require('./modules/moderation/modapi');

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
const memberRoleId = process.env.MEMBER_ROLE_ID; // Replace this with "Member" role ID for your server
const moderatorRoleId = process.env.MODERATOR_ROLE_ID // Replace this with "Moderator" role ID for your server
const mutedRoleId = process.env.MUTED_ROLE_ID // Replace this with "Muted" role ID for your server
const developerRoleId = process.env.DEV_ROLE_ID // Replace with "Developer" Role ID in your server.

const versionNumber = version.version();

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}`);
console.log(`Current version: ${versionNumber}`);
});

// initiate the modules
// deregister.init(client, guildId);

xpSystem.init(client, guildId);
autorole.init(client, guildId, memberRoleId);
verbose.init(client, guildId, vulgarityfilter, developerRoleId, moderatorRoleId, messageRateLimit, mutedRoleId);
tzSetter.init(client, guildId);
time.init(client, guildId);
moderation.init(client, guildId, memberRoleId, dotenv);
linkfinder.init(client, guildId);
linklister.init(client, guildId);
linkadder.init(client, guildId, moderatorRoleId);
selfassign.init(client, guildId, dotenv);
hash.init(client, guildId);
encode.init(client, guildId);
decode.init(client, guildId);
pcifinder.init(client, guildId);
usbfinder.init(client, guildId);
help.init(client, guildId);
rp.init(client);
uptime.init(client, guildId);
version.init(client, guildId);
genplatinfo.init(client, guildId);
checkcoverage.init(client, guildId);
userBuildModule.init(client, guildId);
modApi.init(client, guildId, mutedRoleId, moderatorRoleId);

interactivecli.init(client);

// Discord Login

client.login(process.env.DISCORD_TOKEN);

// Set up the web panel and WebSocket server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use('/web', webPanel(client, guildId, moderatorRoleId, mutedRoleId));

// Define a route handler for "/web/console"
app.get('/web/console', (req, res) => {
  // Serve the HTML file that includes the WebSocket client code for the console
  const consolePagePath = path.join(__dirname, 'modules/web/html/', 'console.html');
  res.sendFile(consolePagePath);
});

// Serve the static HTML file from the 'html' folder
const htmlPath = path.join(__dirname, 'html');
app.use(express.static(htmlPath));

// WebSocket logic for the console route
io.of('/console').on('connection', (socket) => {
  const clientIpAddress = socket.handshake.address.replace(/^.*:/, '');
  console.log(`A client with IP address ${clientIpAddress} connected to /console.`);

  const originalConsoleLog = console.log;
  console.log = function (...args) {
    socket.emit('console', args.join(' '));
    originalConsoleLog.apply(console, args);
  };

  socket.on('disconnect', () => {
    console.log(`A client with IP address ${clientIpAddress} disconnected from /console.`);
    console.log = originalConsoleLog;
  });
});


// Start the web server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Web panel and console WebSocket are running on http://localhost:${PORT}`);
});