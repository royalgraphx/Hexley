// Load modules
const modApi = require('./modapi');
const muteModule = require('./mute');
const unmuteModule = require('./unmute');
const banModule = require('./ban');
const unbanModule = require('./unban');

// Set role IDs
const moderatorRoleId = process.env.MODERATOR_ROLE_ID // Replace this with "Moderator" role ID for your server
const mutedRoleId = process.env.MUTED_ROLE_ID // Replace this with "Muted" role ID for your server. 

function init(client, guildId) {
  // Initialize the API for web panel
  modApi.init(client, guildId, moderatorRoleId);

  // Initialize the modules
  muteModule.init(client, guildId, moderatorRoleId, mutedRoleId);
  unmuteModule.init(client, guildId, moderatorRoleId, mutedRoleId);
  banModule.init(client, guildId, moderatorRoleId);
  unbanModule.init(client, guildId, moderatorRoleId);
  
  // Add any additional moderation-related logic here, if needed
}

module.exports = {
  init,
};