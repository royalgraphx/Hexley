module.exports = {
    init: (client, guildId) => {
      console.log('Verbose module: Initializing...');
  
      client.on('messageCreate', (message) => {
        if (message.guild?.id === guildId) {
          const currentTime = new Date().toLocaleTimeString(); // Get the current time in HH:mm:ss format
          const channelName = message.channel.name;
          const userName = message.author.tag;
          const content = message.content;
  
          console.log(`[${currentTime}] [${channelName}] [${userName}]: ${content}`);
        }
      });
  
      console.log('Verbose module: Initialized!');
    },
  };