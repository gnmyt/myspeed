const axios = require('axios');
const fs = require('fs');

if (!fs.existsSync("data/servers.json")) {
    let servers = {};
    try {
        axios.get("https://www.speedtest.net/api/js/servers?limit=20")
            .then(res => res.data)
            .then(data => {
                data?.forEach(row => {
                    servers[row.id] = row.name + " (" + row.distance + "km)";
                });

                try {
                    fs.writeFileSync("data/servers.json", JSON.stringify(servers, null, 4));
                } catch (e) {
                    console.error("Could not save servers file")
                }
            });
    } catch (e) {
        console.error("Could not get servers");
    }

}
