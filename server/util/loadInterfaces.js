const os = require('os');
const https = require('https');
const config = require('../controller/config');

let usableInterfaces = {};

const requestInterfaces = async () => {
    let interfacesNode = os.networkInterfaces();
    let interfaces = {};

    console.log("Looking for network interfaces...");
    for (let i in interfacesNode) {
        for (let j in interfacesNode[i]) {
            let address = interfacesNode[i][j];

            if (address.internal) continue;

            let options = {hostname: "speed.cloudflare.com", path: "/__down?bytes=1", method: "GET",
                family: address.family === "IPv4" ? 4 : 6, timeout: 5000};

            options.agent = new https.Agent(options);
            options.localAddress = address.address;

            await new Promise((resolve) => {

                const req = https.request(options, () => {
                    if (!interfaces[i]) interfaces[i] = [];
                    interfaces[i].push(address.address);
                    req.destroy();
                    resolve();
                });

                req.on('error', () => resolve());
                req.on('timeout', () => req.destroy());

                req.end();
            });
        }

        if (!interfaces[i]) delete interfaces[i];
    }

    for (let i in interfaces) {
        for (let j in interfaces[i]) {
            if (interfaces[i][j].includes(".")) {
                usableInterfaces[i] = interfaces[i][j];
                break;
            }
        }

        if (!usableInterfaces[i]) usableInterfaces[i] = interfaces[i][0];
    }

    for (let i in usableInterfaces) {
        console.log(`Found interface ${i} with IP ${usableInterfaces[i]}`);
    }

    const currentInterface = await config.getValue("interface");

    if (!usableInterfaces[currentInterface]) {
        if (!currentInterface) {
            console.warn("No interface set. Falling back to default.");
        } else {
            console.warn(`Interface ${currentInterface} not found. Falling back to default.`);
        }
        await config.updateValue("interface", Object.keys(usableInterfaces)[0]);
    }
}

module.exports.requestInterfaces = requestInterfaces;
module.exports.interfaces = usableInterfaces;