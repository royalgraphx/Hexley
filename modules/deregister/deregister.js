const { SlashCommandBuilder } = require('discord.js');

function init(client, guildId) {
    client.on('ready', async () => {
      console.log(`deregister initializing`);
  
    // Unregister existing slash commands
    const existingCommands = await client.guilds.cache.get(guildId).commands.fetch();
    existingCommands.forEach(async (command) => {
      await client.guilds.cache
        .get(guildId)
        .commands.delete(command)
        .then(() => console.log(`Unregistered slash command: ${command.name}`))
        .catch((error) => {
          console.error(`Error occurred while unregistering slash command: ${command.name}`, error);
        });
    });
  
      // Wait for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(`deregister initialized`);

      console.log('deregister: Deregistered Commands successfully.');
    });
}

module.exports = {
    init,
  };