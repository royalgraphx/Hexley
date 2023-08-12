const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const channelId = process.env.SELF_ASSIGN_CHANNEL_ID // Replace this with the actual self assign text channel ID
const amdRoleId = process.env.AMD_ROLE_ID // Replace this with the role ID for AMD
const intelRoleId = process.env.INTEL_ROLE_ID // Replace this with the role ID for Intel

function init(client) {
  // Add a new command to send the self-assign role message
  client.on('messageCreate', async (message) => {
    if (message.content.toLowerCase() === '!setroles') {
      sendSelfAssignMessage(message);
    }
  });

  // Add interaction handling logic for when a user selects a role from the dropdown
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu() || interaction.customId !== 'selfassign_role') {
      return;
    }

    // Handle the selected role based on the interaction values
    const selectedRole = interaction.values[0]; // Assuming only one value is allowed

    // Get the member who made the interaction
    const member = interaction.member;

    // Check if the user already has the selected role
    const hasRole = member.roles.cache.some((role) => role.id === (selectedRole === 'amd' ? amdRoleId : intelRoleId));

    // Toggle the role (add if not present, remove if already present)
    try {
      if (hasRole) {
        await removeRole(member, selectedRole);
      } else {
        await assignRole(member, selectedRole);
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }

    // Acknowledge the interaction with a reply (ephemeral: true means the reply is only visible to the user)
    await interaction.reply({ content: `You have been ${hasRole ? 'removed from' : 'assigned to'} the ${selectedRole.toUpperCase()} role.`, ephemeral: true });
  });

  function sendSelfAssignMessage(message) {
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('selfassign_role')
      .setPlaceholder('Select a role to self-assign')
      .addOptions([
        {
          label: 'AMD CPU',
          value: 'amd',
        },
        {
          label: 'Intel CPU',
          value: 'intel',
        },
        // Add more options as needed
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Send the message to the specified text channel
    message.client.channels.cache.get(channelId).send({
      content: 'Select a role from the dropdown below:',
      components: [row],
    });

    console.log('Self-assign role message sent.');
  }

  async function assignRole(member, selectedRole) {
    const roleId = selectedRole === 'amd' ? amdRoleId : intelRoleId;
    const role = member.guild.roles.cache.get(roleId);
    if (!role) {
      console.error(`Role with ID ${roleId} not found.`);
      return;
    }

    try {
      await member.roles.add(role);
      console.log(`Assigned role ${selectedRole.toUpperCase()} to user ${member.user.tag}`);
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  }

  async function removeRole(member, selectedRole) {
    const roleId = selectedRole === 'amd' ? amdRoleId : intelRoleId;
    const role = member.guild.roles.cache.get(roleId);
    if (!role) {
      console.error(`Role with ID ${roleId} not found.`);
      return;
    }

    try {
      await member.roles.remove(role);
      console.log(`Removed role ${selectedRole.toUpperCase()} from user ${member.user.tag}`);
    } catch (error) {
      console.error('Error removing role:', error);
    }
  }
}

module.exports = {
  init,
};