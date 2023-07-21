const readline = require('readline');

module.exports = {
  init: (client) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', async (line) => {
      // Format for sending messages: "channelID messageContent"
      const [channelId, ...messageParts] = line.split(' ');
      const messageContent = messageParts.join(' ');

      const channel = client.channels.cache.get(channelId);
      if (!channel) {
        console.error(`Channel not found for ID: ${channelId}`);
        return;
      }

      try {
        const message = await channel.send(messageContent);
        console.log(`Message sent in ${channel.name} (ID: ${channel.id}): ${message.content}`);
      } catch (error) {
        console.error(`Error sending message - ${error.message}`);
      }
    });

    console.log('Interactive CLI module: Ready! You can now send messages as the bot.');
  },
};