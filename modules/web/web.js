const express = require('express');
const path = require('path'); // Import the 'path' module

// Import the uptime module
const uptimeModule = require('../uptime/uptime');

module.exports = (client) => {
  const app = express();

  // Define a route handler for "/web/uptime"
  app.get('/uptime', (req, res) => {
    // Get the uptime data from the uptime module by passing the correct client object
    const uptime = uptimeModule.getUptime(client);

    // Send the uptime data as JSON in the response
    res.json({ uptime });
  });

  // Serve the static HTML file from the 'html' folder
  const htmlPath = path.join(__dirname, 'html'); // Get the absolute path to the 'html' folder
  app.use(express.static(htmlPath));

  return app;
};