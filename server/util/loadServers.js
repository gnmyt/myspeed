const axios = require('axios');
const fs = require('fs');

// Load servers from ookla
if (!fs.existsSync("data/servers/ookla.json")) {
    let servers = {};
    try {
        axios.get("https://www.speedtest.net/api/js/servers?limit=20")
            .then(res => res.data)
            .then(data => {
                data?.forEach(row => {
                    servers[row.id] = row.name + " (" + row.distance + "km)";
                });

                try {
                    fs.writeFileSync("data/servers/ookla.json", JSON.stringify(servers, null, 4));
                } catch (e) {
                    console.error("Could not save servers file");
                }
            });
    } catch (e) {
        console.error("Could not get servers");
    }
}

// Load servers from librespeed
if (!fs.existsSync("data/servers/librespeed.json")) {
    let servers = {};
    try {
        axios.get("https://librespeed.org/backend-servers/servers.php")
            .then(res => res.data)
            .then(data => {
                data?.forEach(row => {
                    servers[row.id] = row.name;
                });
                try {
                    fs.writeFileSync("data/servers/librespeed.json", JSON.stringify(servers, null, 4));
                } catch (e) {
                    console.error("Could not save servers file");
                }
            });
    } catch (e) {
        console.error("Could not get servers");
    }
}