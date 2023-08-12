const { SlashCommandBuilder } = require('discord.js');
const https = require('https');

async function fetchPCIdata() {
  return new Promise((resolve, reject) => {
    const url = 'https://raw.githubusercontent.com/pciutils/pciids/master/pci.ids';
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function findPCI(vendorId, deviceId) {
  try {
    const pciData = await fetchPCIdata();

    const lines = pciData.split('\n');
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
    console.error('Error fetching PCI data:', error);
    return 'An error occurred while fetching PCI data. Please try again later.';
  }
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
      .catch((error) => {
        console.error('Error occurred while registering slash command: pci', error);
      });

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