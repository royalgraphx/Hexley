const readline = require('readline');

module.exports = {
  init: (client) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', async (line) => {
      // Trim the input line to remove leading/trailing spaces
      const input = line.trim();

      if (input === 'stop') {
        console.log('Stopping the bot...');
        rl.close(); // Close the readline interface
        client.destroy(); // Gracefully close the Discord bot connection
        process.exit(0); // Exit the process with a success status code (0)
        return;
      } else if (input === 'stats') {
        // Calculate bot's uptime
        const uptimeInMs = client.uptime;
        const uptimeInSeconds = Math.floor(uptimeInMs / 1000);
        const uptimeInMinutes = Math.floor(uptimeInSeconds / 60);
        const uptimeInHours = Math.floor(uptimeInMinutes / 60);
        const uptimeInDays = Math.floor(uptimeInHours / 24);

        console.log(`Bot Uptime: ${uptimeInDays} days, ${uptimeInHours % 24} hours, ${uptimeInMinutes % 60} minutes`);
        return;
      }

      // Format for sending messages: "channelID messageContent"
      const [channelId, ...messageParts] = input.split(' ');
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

    console.log('Interactive CLI module: Ready! You can now interact with the terminal.');
  },
};