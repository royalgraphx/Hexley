const express = require('express');
const path = require('path'); // Import the 'path' module
const app = express();

// Import the uptime module
const uptimeModule = require('../uptime/uptime');

// Define a route handler for "/web/uptime"
app.get('/uptime', (req, res) => {
  // Get the uptime data from the uptime module by passing the correct client object
  const uptime = uptimeModule.getUptime(req.client); // Use req.client instead of just client

  // Send the uptime data as JSON in the response
  res.json({ uptime });
});

// Serve the static HTML file from the 'html' folder
const htmlPath = path.join(__dirname, 'html'); // Get the absolute path to the 'html' folder
app.use(express.static(htmlPath));

// Export the app with the custom route and client object
module.exports = (client) => {
  return app;
};