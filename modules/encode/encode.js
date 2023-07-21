const base64 = require('./base64');
const hex = require('./hex');

function init(client, guildId) {
  // Initialize any necessary commands or event listeners here
  base64.init(client, guildId);
  hex.init(client, guildId);
}

module.exports = {
  init,
  base64,
  hex,
};
