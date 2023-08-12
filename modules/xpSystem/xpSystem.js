const fs = require('fs');
const { SlashCommandBuilder } = require('discord.js');

const userXPFile = 'modules/xpSystem/user_xp.json';
const positiveWordsFile = 'modules/xpSystem/positive_words.txt';
const negativeWordsFile = 'modules/xpSystem/negative_words.txt';

let positiveWords = [];
let negativeWords = [];

function init(client, guildId) {

  // Register slash commands and load positive/negative words
  client.on('ready', async () => {
    console.log(`xpSystem module: initializing`);

    // Register the /leaderboard command
    const leaderboardCommand = new SlashCommandBuilder()
      .setName('leaderboard')
      .setDescription('Displays the current leaderboard!');

    await client.guilds.cache
      .get(guildId)
      .commands.create(leaderboardCommand)
      .then(() => console.log('Registered slash command: leaderboard'))
      .catch((error) => {
        console.error('Error occurred while registering slash command: leaderboard', error);
      });

    // Load positive words from file
    try {
      positiveWords = fs.readFileSync(positiveWordsFile, 'utf-8').split('\n');
      console.log(`Positive words loaded successfully (${positiveWords.length} words)`);
    } catch (error) {
      console.error('Failed to load positive words:', error);
    }

    // Load negative words from file
    try {
      negativeWords = fs.readFileSync(negativeWordsFile, 'utf-8').split('\n');
      console.log(`Negative words loaded successfully (${negativeWords.length} words)`);
    } catch (error) {
      console.error('Failed to load negative words:', error);
    }

    console.log('xpSystem module: initialized');
  });

  function containsExactWord(message, word) {
    const wordsInMessage = message.split(/\s+/);
    return wordsInMessage.includes(word);
  }

  // Reaction to messages containing positive/negative words
  client.on('messageCreate', (message) => {

    // Check if the message contains positive or negative words
    const content = message.content;
    const containsPositiveWord = positiveWords.some(word => containsExactWord(content, word));
    const containsNegativeWord = negativeWords.some(word => containsExactWord(content, word));

    if (containsPositiveWord) {
      message.react('✅')
        .then(() => {
          console.log('Reacted with ✅');
          // Increment XP for the user in the JSON table
          const userData = fs.readFileSync(userXPFile, 'utf-8');
          const userXP = JSON.parse(userData);

          if (userXP[message.author.id]) {
            userXP[message.author.id] += 1;
          } else {
            userXP[message.author.id] = 1;
          }

          fs.writeFileSync(userXPFile, JSON.stringify(userXP, null, 2), 'utf-8');
          console.log(`XP incremented for user ${message.author.tag}`);
        })
        .catch(console.error);
    }

    if (containsNegativeWord) {
      message.react('❌')
        .then(() => console.log('Reacted with ❌'))
        .catch(console.error);
    }
  });

  // Handle /leaderboard command
  client.on('interactionCreate', async (interaction) => {
    if (interaction.commandName === 'leaderboard') {
      // Read the user XP data from the JSON file
      const userData = fs.readFileSync(userXPFile, 'utf-8');
      const userXP = JSON.parse(userData);

      // Sort the user XP data by descending order
      const sortedXP = Object.entries(userXP).sort((a, b) => b[1] - a[1]);

      // Extract the top 10 users
      const topUsers = sortedXP.slice(0, 10);

      // Create the leaderboard message
      let leaderboardMessage = 'Top 10 Leaderboard:\n';

      for (const [userId, xp] of topUsers) {
        try {
          const member = await interaction.guild.members.fetch(userId);
          const username = member.user.username;
          leaderboardMessage += `${username}: ${xp} XP\n`;
        } catch (error) {
          console.error(`Failed to fetch username for user ID ${userId}:`, error);
          leaderboardMessage += `Unknown User: ${xp} XP\n`;
        }
      }

      await interaction.reply(leaderboardMessage);
    }
  });
}

module.exports = {
  init,
};