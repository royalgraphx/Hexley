let guildId; // ID of the guild (server)
let moderatorRoleId; // ID of the "Moderator" role for the guild
let mutedRoleId; // ID of the "Muted" role for the guild
let client; // Discord.js Client

function init(_client, _guildId, _mutedRoleId, _moderatorRoleId) {
  client = _client;
  guildId = _guildId;
  mutedRoleId = _mutedRoleId;
  moderatorRoleId = _moderatorRoleId;
}

async function fetchModerators() {
  try {
    // Fetch the guild object using the provided guildId
    const guild = client.guilds.cache.get(guildId);
    if (!guild) throw new Error('Guild not found');

    // Fetch the moderator role object using the provided moderatorRoleId
    const moderatorRole = guild.roles.cache.get(moderatorRoleId);
    if (!moderatorRole) throw new Error('Moderator role not found');

    // Fetch all members who have the moderator role
    const moderators = guild.members.cache.filter((member) =>
      member.roles.cache.has(moderatorRole.id)
    );

    // Return the list of moderators
    return moderators.map((moderator) => ({
      id: moderator.id,
      username: moderator.user.username,
      discriminator: moderator.user.discriminator,
      avatarURL: moderator.user.displayAvatarURL({ dynamic: true }),
    }));
  } catch (error) {
    throw error;
  }
}

async function fetchMutedUsers() {
  try {
    // Fetch the guild object using the provided guildId
    const guild = client.guilds.cache.get(guildId);
    if (!guild) throw new Error('Guild not found');

    // Fetch the muted role object using the provided mutedRoleId
    const mutedRole = guild.roles.cache.get(mutedRoleId);
    if (!mutedRole) throw new Error('Muted role not found');

    // Fetch all members who have the muted role
    const mutedUsers = guild.members.cache.filter((member) =>
      member.roles.cache.has(mutedRole.id)
    );

    // Return the list of muted users (or you can return the data in any other format you desire)
    return mutedUsers.map((user) => ({
      id: user.id,
      username: user.user.username,
      discriminator: user.user.discriminator,
      avatarURL: user.user.displayAvatarURL({ dynamic: true }),
    }));
  } catch (error) {
    throw error;
  }
}

async function fetchBannedUsers() {
  try {
    // Fetch the guild object using the provided guildId
    const guild = client.guilds.cache.get(guildId);
    if (!guild) throw new Error('Guild not found');

    // Fetch all banned users from the guild using the bans manager
    const bannedUsers = await guild.bans.fetch();

    // Return the list of banned users
    return bannedUsers.map((ban) => ({
      id: ban.user.id,
      username: ban.user.username,
      discriminator: ban.user.discriminator,
      avatarURL: ban.user.displayAvatarURL({ dynamic: true }),
    }));
  } catch (error) {
    throw error;
  }
}

module.exports = {
  init,
  fetchModerators,
  fetchMutedUsers,
  fetchBannedUsers,
};