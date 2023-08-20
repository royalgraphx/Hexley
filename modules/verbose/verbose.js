module.exports = {
    init: (client, guildId, vulgarityfilter, developerRoleId, moderatorRoleId, messageRateLimit, mutedRoleId) => {
      console.log('Verbose module: Initializing...');
  
      client.on('messageCreate', (message) => {
        if (message.guild?.id === guildId) {
          const currentTime = new Date().toLocaleTimeString(); // Get the current time in HH:mm:ss format
          const channelName = message.channel.name;
          const userName = message.author.tag;
          const content = message.content;

          messageRateLimit.messageRateLimit(message, 5, 10, 3, mutedRoleId); // maxMessages, timeSpanInSeconds, strikeThreshold 
          console.log(`[${currentTime}] [${channelName}] [${userName}]: ${content}`);
          vulgarityfilter.vulgarityFilter(message, developerRoleId, moderatorRoleId);
        }
      });
  
      console.log('Verbose module: Initialized!');
    },
  };