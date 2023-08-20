// Load modules
const addBuildCommand = require('./addbuild');
const removeBuildCommand = require('./removebuild');
const updateBuildCommand = require('./updatebuild');
const buildViewerCommand = require('./buildviewer');

function init(client, guildId) {

    // Initialize the modules
    buildViewerCommand.init(client, guildId);
    addBuildCommand.init(client, guildId);
    removeBuildCommand.init(client, guildId);

    // Add any additional build-related logic here, if needed.
  }
  
module.exports = {
  init,
};