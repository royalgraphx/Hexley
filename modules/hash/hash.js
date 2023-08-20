const sha512 = require('./sha512');

function init(client, guildId) {
  // Initialize any necessary commands or event listeners here
  sha512.init(client, guildId);
}

module.exports = {
  init,
  sha512,
};