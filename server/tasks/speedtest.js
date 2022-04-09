const speedTest = require('speedtest-net');
const tests = require('../controller/speedtests');
const config = require('../controller/config');

function roundSpeed(bytes, elapsed) {
    return Math.round((bytes * 8 / elapsed) / 10) / 100;
}

module.exports.run = async () => {
    let serverId = config.get("serverId").value;
    if (serverId === "none")
        serverId = undefined;

    let speedtest = await speedTest({acceptLicense: true, acceptGdpr: true, serverId: serverId});

    if (serverId === undefined)
        config.update("serverId", speedtest.server.id);

    return speedtest;
}

module.exports.create = async () => {
    let test = await this.run();
    let ping = Math.round(test.ping.latency);
    let download = roundSpeed(test.download.bytes, test.download.elapsed);
    let upload = roundSpeed(test.upload.bytes, test.upload.elapsed);
    let testResult = tests.create(ping, download, upload);
    console.log(`Test #${testResult} was executed successfully. 🏓 ${ping} ⬇ ${download}️ ⬆ ${upload}️`);
}

module.exports.removeOld = () => {
    tests.removeOld();
}