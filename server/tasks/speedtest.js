const speedTest = require('../util/speedtest');
const tests = require('../controller/speedtests');
const config = require('../controller/config');
const recommendations = require("../controller/recommendations");

let isRunning = false;

function roundSpeed(bytes, elapsed) {
    return Math.round((bytes * 8 / elapsed) / 10) / 100;
}

async function createRecommendations() {
    let list = (await tests.list()).filter((entry) => !entry.error);
    if (list.length >= 10) {
        let avgNumbers = {ping: 0, down: 0, up: 0};
        for (let i = 0; i < 10; i++) {
            avgNumbers["ping"] += list[i].ping;
            avgNumbers["down"] += list[i].download;
            avgNumbers["up"] += list[i].upload;
        }

        await recommendations.set(avgNumbers["ping"] / 10, avgNumbers["down"] / 10, avgNumbers["up"] / 10);
    }
}

module.exports.run = async (retryAuto = false) => {
    isRunning = true;
    let serverId = (await config.get("serverId")).value;

    if (serverId === "none")
        serverId = undefined;

    let speedtest = await (retryAuto ? speedTest() : speedTest(serverId));

    if (serverId === undefined)
        await config.update("serverId", speedtest.server.id);

    if (Object.keys(speedtest).length === 0) throw {message: "No response, even after trying again, test timed out."};

    return speedtest;
}

module.exports.create = async (type = "auto", retried = false) => {
    if (isRunning && !retried) return 500;

    try {
        let test = await this.run(retried);
        let ping = Math.round(test.ping.latency);
        let download = roundSpeed(test.download.bytes, test.download.elapsed);
        let upload = roundSpeed(test.upload.bytes, test.upload.elapsed);
        let time = Math.round((test.download.elapsed + test.upload.elapsed) / 1000);
        let testResult = await tests.create(ping, download, upload, time, type);
        console.log(`Test #${testResult} was executed successfully in ${time}s. 🏓 ${ping} ⬇ ${download}️ ⬆ ${upload}️`);
        createRecommendations().then(() => "");
    } catch (e) {
        if (!retried) return this.create(type, true);
        let testResult = await tests.create(-1, -1, -1, null, type, e.message);
        console.log(`Test #${testResult} was not executed successfully. Please try reconnecting to the internet or restarting the software: ` + e.message);
    }
    isRunning = false;
}

module.exports.isRunning = () => isRunning;

module.exports.removeOld = async () => {
    await tests.removeOld();
}