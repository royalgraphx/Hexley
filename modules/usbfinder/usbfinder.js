const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

async function fetchUSBdata() {
    try {
      const response = await axios.get('http://www.linux-usb.org/usb.ids');
      return response.data;
    } catch (error) {
      throw error;
    }
}

async function findUSB(vendorId, deviceId) {
  try {
    const usbData = await fetchUSBdata();

    const lines = usbData.split('\n');
    let currentVendor;
    let currentDevice;
    const vendors = new Map();

    for (const line of lines) {
      if (line.startsWith('#')) {
        continue;
      }

      if (!line.startsWith('\t')) {
        const [id, name] = line.trim().split('  ');
        currentVendor = { ID: id, Name: name, Devices: new Map() };
        vendors.set(id, currentVendor);
      } else if (line.startsWith('\t\t')) {
        const [id, name] = line.trim().split('  ');
        currentDevice = { ID: id, Name: name };
        currentVendor.Devices.set(id, currentDevice);
      } else if (line.startsWith('\t')) {
        const [id, name] = line.trim().split('  ');
        currentDevice = { ID: id, Name: name };
        currentVendor.Devices.set(id, currentDevice);
      }
    }

    const vendor = vendors.get(vendorId);

    if (!vendor) {
      return 'Vendor not found.';
    }

    const device = vendor.Devices.get(deviceId);

    if (!device) {
      return 'Device not found for the given vendor.';
    }

    return `Vendor: ${vendor.Name}\nDevice: ${device.Name}`;
  } catch (error) {
    console.error('Error fetching USB data:', error);
    return 'An error occurred while fetching USB data. Please try again later.';
  }
}

function init(client, guildId) {
  client.on('ready', () => {
    console.log('usbfinder command initializing');

    const usbCommand = new SlashCommandBuilder()
      .setName('usb')
      .setDescription('Find USB devices by vendor ID and device ID.')
      .addStringOption((option) => option.setName('vendor_id').setDescription('The vendor ID (e.g., 0001)').setRequired(true))
      .addStringOption((option) => option.setName('device_id').setDescription('The device ID (e.g., 7778)').setRequired(true));

    // Register the /usb command
    client.guilds.cache
      .get(guildId)
      .commands.create(usbCommand)
      .then(() => console.log('Registered slash command: usb'))
      .catch(console.error);

    console.log('usbfinder command initialized');
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'usb') {
      const vendorId = interaction.options.getString('vendor_id');
      const deviceId = interaction.options.getString('device_id');

      if (!vendorId || !deviceId) {
        await interaction.reply('Please provide both vendor ID and device ID.');
        return;
      }

      const response = await findUSB(vendorId, deviceId);

      await interaction.reply(response);
    }
  });
}

module.exports = {
  init,
};