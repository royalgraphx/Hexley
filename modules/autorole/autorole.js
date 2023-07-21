module.exports = {
    init: (client, guildId, roleId) => {
      console.log('Autorole module: Initializing...');
  
      client.on('guildMemberAdd', (member) => {
        if (member.guild.id === guildId) {
          const role = member.guild.roles.cache.get(roleId);
          if (role) {
            member.roles.add(role).then(() => {
              console.log(`Autorole: Assigned role "${role.name}" to ${member.user.tag}`);
            }).catch((error) => {
              console.error(`Autorole: Error assigning role - ${error.message}`);
            });
          } else {
            console.error('Autorole: Role not found. Make sure you provide the correct role ID.');
          }
        }
      });
  
      console.log('Autorole module: Initialized!');
    },
  };