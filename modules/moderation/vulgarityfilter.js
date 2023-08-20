const fs = require('fs');

// Load the list of vulgar words from vulgarity_dict.txt
const vulgarWords = fs.readFileSync('./modules/moderation/vulgarity_dict.txt', 'utf-8').split('\n');

// Export the vulgarity filter function
module.exports = {
  vulgarityFilter: function(message, developerRoleId, moderatorRoleId) {
    const content = message.content.toLowerCase();

    // Check if the user has the developer or moderator role
    const hasDeveloperRole = message.member.roles.cache.has(developerRoleId);
    const hasModeratorRole = message.member.roles.cache.has(moderatorRoleId);

    // If the user has the developer or moderator role, allow the message
    if (hasDeveloperRole || hasModeratorRole) {
      return;
    }

    // Check if the message contains any vulgar words
    const containsVulgarWord = vulgarWords.some(word => content.includes(word));

    if (containsVulgarWord) {
      // Delete the original message
      message.delete();

      // Reply in the same channel, tagging the user
      message.channel.send(`${message.author}, please do not use vulgar language.`)
        .then(sentMessage => {
          // Delete the reply message after a certain time (e.g., 5 seconds)
          setTimeout(() => sentMessage.delete(), 5000);
        })
        .catch(error => {
          console.error(`Failed to send reply message: ${error}`);
        });

      // You can also log this event if you want
      console.log(`Deleted message from ${message.author.tag} for vulgarity.`);
    }
  }
};