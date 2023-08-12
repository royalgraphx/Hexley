// Function to fetch data from the API and populate the uptime widget
function fetchUptimeAndPopulateWidget() {
    fetch('/web/uptime')
        .then(response => response.json())
        .then(data => {
            const uptimeContent = document.getElementById('uptimeContent');
            uptimeContent.innerHTML = `<h2>${data.uptime}</h2>`;
        })
        .catch(error => {
            console.error('Error fetching uptime data:', error);
        });
}

// Function to fetch data from the API and populate the moderators widget
function fetchModeratorsAndPopulateWidget() {
    fetch('/web/moderators')
        .then(response => response.json())
        .then(data => {
            const moderatorsContent = document.getElementById('moderatorsContent');
            // Generate HTML for displaying moderator information
            const moderatorsHTML = data.moderators.map(moderator => `
                <div class="moderator">
                    <img src="${moderator.avatarURL}" alt="${moderator.username}'s Avatar">
                    <span>${moderator.username}#${moderator.discriminator}</span>
                </div>
            `).join('');
            moderatorsContent.innerHTML = moderatorsHTML;
        })
        .catch(error => {
            console.error('Error fetching moderators data:', error);
        });
}

// Function to fetch data from the API and populate the muted widget
function fetchMutedUsersAndPopulateWidget() {
    fetch('/web/mutedusers')
        .then(response => response.json())
        .then(data => {
            const mutedContent = document.getElementById('mutedContent');
            // Generate HTML for displaying muted users' information
            const mutedHTML = data.mutedUsers.map(mutedUser => `
                <div class="muted">
                    <img src="${mutedUser.avatarURL}" alt="${mutedUser.username}'s Avatar">
                    <span>${mutedUser.username}#${mutedUser.discriminator}</span>
                </div>
            `).join('');
            mutedContent.innerHTML = mutedHTML;
        })
        .catch(error => {
            console.error('Error fetching muted users data:', error);
        });
}

// Function to fetch console output through WebSocket
function fetchConsoleOutputAndPopulateWidget() {
    const socket = io('/console');
  
    socket.on('connect', () => {
      console.log('Connected to /console.');
    });
  
    socket.on('console', (data) => {
      const consoleContent = document.getElementById('consoleContent');
      consoleContent.innerHTML += `<p>${data}</p>`;
      console.log('Console output:', data);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from /console.');
    });
}

// Function to fetch data from the API and populate the banned users widget
function fetchBannedUsersAndPopulateWidget() {
    fetch('/web/bannedusers')
        .then(response => response.json())
        .then(data => {
            const bannedContent = document.getElementById('bannedContent');
            // Generate HTML for displaying banned users' information
            const bannedHTML = data.bannedUsers.map(bannedUser => `
                <div class="banned">
                    <img src="${bannedUser.avatarURL}" alt="${bannedUser.username}'s Avatar">
                    <span>${bannedUser.username}#${bannedUser.discriminator}</span>
                </div>
            `).join('');
            bannedContent.innerHTML = bannedHTML;
        })
        .catch(error => {
            console.error('Error fetching banned users data:', error);
        });
}

// Call the functions to initially populate both widgets
fetchUptimeAndPopulateWidget();
fetchModeratorsAndPopulateWidget();
fetchMutedUsersAndPopulateWidget();
fetchConsoleOutputAndPopulateWidget();
fetchBannedUsersAndPopulateWidget();

// Optionally, you can set up a timer to refresh the data periodically
setInterval(fetchUptimeAndPopulateWidget, 60000); // 60000 ms = 1 min
setInterval(fetchModeratorsAndPopulateWidget, 60000); // 60000 ms = 1 min
setInterval(fetchMutedUsersAndPopulateWidget, 60000); // 60000 ms = 1 min
setInterval(fetchBannedUsersAndPopulateWidget, 60000); // 60000 ms = 1 min