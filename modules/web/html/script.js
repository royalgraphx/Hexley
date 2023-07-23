// Function to fetch data from the API and populate the uptime widget
function fetchUptimeAndPopulateWidget() {
    fetch('/web/uptime')
        .then(response => response.json())
        .then(data => {
            const uptimeContent = document.getElementById('uptimeContent');
            uptimeContent.innerHTML = `<h2>Uptime: ${data.uptime}</h2>`;
        })
        .catch(error => {
            console.error('Error fetching uptime data:', error);
        });
}

// Call the function to initially populate the uptime widget
fetchUptimeAndPopulateWidget();

// Optionally, you can set up a timer to refresh the data periodically
setInterval(fetchUptimeAndPopulateWidget, 5000); // 5000 milliseconds = 5 seconds