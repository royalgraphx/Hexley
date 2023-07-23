// moderation.js

// Load modules
const modApi = require('./modapi');
const muteModule = require('./mute');
const unmuteModule = require('./unmute');

// Set role IDs
const moderatorRoleId = '1131556030438981682'; // Replace this with "Moderator" role ID for your server
const mutedRoleId = '1131715688038400080'; // Replace this with "Muted" role ID for your server

function init(client, guildId) {
  // Initialize the API for web panel
  modApi.init(client, guildId, moderatorRoleId);

  // Initialize the modules
  muteModule.init(client, guildId, moderatorRoleId, mutedRoleId);
  unmuteModule.init(client, guildId, moderatorRoleId, mutedRoleId);

  // Add any additional moderation-related logic here, if needed
}

module.exports = {
  init,
};