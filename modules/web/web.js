const express = require('express');
const path = require('path');

// Import the uptime module
const uptimeModule = require('../uptime/uptime');

// Import the modapi.js module
const modApi = require('../moderation/modapi');

module.exports = (client) => {
  const app = express();

  // Define a route handler for "/web/uptime"
  app.get('/uptime', (req, res) => {
    // Get the uptime data from the uptime module by passing the correct client object
    const uptime = uptimeModule.getUptime(client);

    // Send the uptime data as JSON in the response
    res.json({ uptime });
  });

  // Define a route handler for "/web/moderators"
  app.get('/moderators', async (req, res) => {
    try {
      // Fetch data about users with the moderator role from modapi.js module
      const moderators = await modApi.fetchModerators();

      // Send the moderator data as JSON in the response
      res.json({ moderators });
    } catch (error) {
      // If an error occurs, send an error response
      res.status(500).json({ error: 'Failed to fetch moderator data' });
    }
  });

   // Define a route handler for "/web/mutedusers"
   app.get('/mutedusers', async (req, res) => {
    try {
      // Fetch data about users with the muted role from modapi.js module
      const mutedUsers = await modApi.fetchMutedUsers();

      // Send the muted users data as JSON in the response
      res.json({ mutedUsers });
    } catch (error) {
      // If an error occurs, send an error response
      res.status(500).json({ error: 'Failed to fetch muted users data' });
    }
  });

  // Serve the static HTML file from the 'html' folder
  const htmlPath = path.join(__dirname, 'html'); // Get the absolute path to the 'html' folder
  app.use(express.static(htmlPath));

  return app;
};