const messageCooldowns = new Map();
const userStrikes = new Map();

module.exports = {
  messageRateLimit: async function(message, maxMessages, timeSpanInSeconds, strikeThreshold, mutedRoleId) {
    // Check if the message is from a bot, or if it's a DM
    if (message.author.bot || !message.guild) {
      return;
    }

    const userId = message.author.id;

    // Initialize cooldown and strikes for the user if not present
    if (!messageCooldowns.has(userId)) {
      messageCooldowns.set(userId, []);
    }
    if (!userStrikes.has(userId)) {
      userStrikes.set(userId, 0);
    }

    const now = Date.now();
    const userCooldowns = messageCooldowns.get(userId);

    // Remove messages that are outside the time span
    while (userCooldowns.length > 0 && userCooldowns[0] < now - (timeSpanInSeconds * 1000)) {
      userCooldowns.shift();
    }

    // Check if the user has exceeded the message limit
    if (userCooldowns.length >= maxMessages) {
      const strikes = userStrikes.get(userId) + 1;
      userStrikes.set(userId, strikes);

      if (strikes >= strikeThreshold) {
        const user = message.guild.members.cache.get(userId);

        // Apply the muted role
        if (user && mutedRoleId) {
          user.roles.add(mutedRoleId).catch(error => {
            console.error(`Failed to add muted role: ${error}`);
          });
        }

        // Delete last 5 messages
        const messagesToDelete = await message.channel.messages.fetch({ limit: 8 });
        message.channel.bulkDelete(messagesToDelete, true).catch(error => {
          console.error(`Failed to delete messages: ${error}`);
        });

        // Reset strikes and cooldowns
        userStrikes.set(userId, 0);
        userCooldowns.length = 0;

        // Send a message about the muted status
        message.channel.send(`${message.author}, you have been muted for spamming.`)
          .then(sentMessage => {
            setTimeout(() => sentMessage.delete(), 5000);
          })
          .catch(error => {
            console.error(`Failed to send mute message: ${error}`);
          });

        // Log the mute action
        console.log(`User ${message.author.tag} has been muted for exceeding strikes.`);
      } else {
        // Send a warning about message rate limit
        message.channel.send(`${message.author}, you're sending messages too quickly! Slow down. Warning ${strikes}/${strikeThreshold}`)
          .then(sentMessage => {
            setTimeout(() => sentMessage.delete(), 5000);
          })
          .catch(error => {
            console.error(`Failed to send rate limit warning: ${error}`);
          });

        // Delete last 5 messages
        const messagesToDelete = await message.channel.messages.fetch({ limit: 5 });
        message.channel.bulkDelete(messagesToDelete, true).catch(error => {
          console.error(`Failed to delete messages: ${error}`);
        });

        // Log the warning
        console.log(`User ${message.author.tag} has been warned. Strikes: ${strikes}/${strikeThreshold}`);
      }

      // Clear cooldowns
      userCooldowns.length = 0;
    }

    // Add the current message's timestamp to the user's cooldowns
    userCooldowns.push(now);
  }
};