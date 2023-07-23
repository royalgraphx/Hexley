const { GatewayIntentBits, ActivityType } = require('discord.js');

let currentPresence = null; // Variable to store the current presence

function init(client) {
  // Check if the bot has Gateway Intent for Rich Presence
  if (!client.options.intents.has(GatewayIntentBits.GuildPresences)) {
    console.error('GatewayIntentBits.GuildPresences is not enabled. Rich Presence will not work.');
    return;
  }

  // combat race condition, Register a 'ready' event listener to set the initial and periodic Rich Presence
  client.once('ready', () => {
    console.log(`customrp module: initialized`);

    // Set the initial Rich Presence
    updateRichPresence(client);
  });

  // Listen for 'error' event to catch any presence-related errors
  client.on('error', console.error);
}

function updateRichPresence(client) {
    // Customize the Rich Presence details here
    const presenceData = {
      activities: [
        {
          name: 'over DarwinKVM!',
          type: ActivityType.Watching,
        },
      ],
      status: 'idle', // Possible values: 'online', 'idle', 'dnd', 'invisible'
      afk: false,
    };

  // Ensure the client.user object is available before setting the presence
  if (client.user) {

    const newPresence = presenceData.activities[0];
    if (JSON.stringify(currentPresence) !== JSON.stringify(newPresence)) {
      console.log('customrp module: Rich Presence updated successfully.');
      if (currentPresence) {
        console.log('customrp module: Previous Presence:', currentPresence);
      } else {
        console.log('customrp module: Previous Presence: None (initial update)');
      }
      console.log('customrp module: New Presence:', newPresence);

      currentPresence = newPresence;

      client.user.setPresence(presenceData);
    }
  } else {
    console.error('customrp module: Error: client.user object not available.');
  }
}

module.exports = {
  init,
};