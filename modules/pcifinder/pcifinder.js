const { SlashCommandBuilder } = require('discord.js');
const { parsePCI } = require('./parsePCI');

async function findPCI(vendorId, deviceId) {
  const pciData = await parsePCI();
  const vendor = pciData.get(vendorId);
  if (!vendor) {
    return 'Vendor not found.';
  }

  const device = vendor.Devices.get(deviceId);
  if (!device) {
    return 'Device not found for the given vendor.';
  }

  return `Vendor: ${vendor.Name}\nDevice: ${device.Name}`;
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('pcifinder command initializing');

    const pciCommand = new SlashCommandBuilder()
      .setName('pci')
      .setDescription('Find PCI devices by vendor ID and device ID.')
      .addStringOption((option) => option.setName('vendor_id').setDescription('The vendor ID (e.g., 10DE)').setRequired(true))
      .addStringOption((option) => option.setName('device_id').setDescription('The device ID (e.g., 1C03)').setRequired(true));

    // Register the /pci command
    client.guilds.cache
      .get(guildId)
      .commands.create(pciCommand)
      .then(() => console.log('Registered slash command: pci'))
      .catch(console.error);

    console.log('pcifinder command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'pci') {
      const vendorId = interaction.options.getString('vendor_id');
      const deviceId = interaction.options.getString('device_id');

      if (!vendorId || !deviceId) {
        await interaction.reply('Please provide both vendor ID and device ID.');
        return;
      }

      const response = await findPCI(vendorId, deviceId);

      await interaction.reply(response);
    }
  });
}

module.exports = {
  init,
};