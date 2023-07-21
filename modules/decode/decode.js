const base64 = require('./base64');

function init(client, guildId) {
  // Initialize any necessary commands or event listeners here
  base64.init(client, guildId);
}

module.exports = {
  init,
  base64,
};