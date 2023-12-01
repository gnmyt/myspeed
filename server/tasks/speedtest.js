const speedTest = require('../util/speedtest');
const tests = require('../controller/speedtests');
const config = require('../controller/config');
const controller = require("../controller/recommendations");
let {setState, sendRunning, sendError, sendFinished} = require("./integrations");

let isRunning = false;

const roundSpeed = (bytes, elapsed) => {
    return Math.round((bytes * 8 / elapsed) / 10) / 100;
}

const setRunning = (running, sendRequest = true) => {
    isRunning = running;

    if (running) {
        setState("running");
        if (sendRequest) sendRunning().then(undefined);
    } else {
        setState("ping");
    }
}

const createRecommendations = async () => {
    let list = (await tests.listTests()).filter((entry) => !entry.error);
    if (list.length >= 10) {
        let recommendations = {ping: 1000, down: 0, up: 0};
        for (let i = 0; i < 10; i++) {
            if (list[i].ping < recommendations["ping"]) recommendations["ping"] = list[i].ping;
            if (list[i].download > recommendations["down"]) recommendations["down"] = list[i].download;
            if (list[i].upload > recommendations["up"]) recommendations["up"] = list[i].upload;
        }

        await controller.update(recommendations["ping"], recommendations["down"], recommendations["up"]);
    }
}

module.exports.run = async (retryAuto = false) => {
    setRunning(true);
    let serverId = await config.getValue("serverId");

    if (serverId === "none")
        serverId = undefined;

    let speedtest = await (retryAuto ? speedTest() : speedTest(serverId));

    if (serverId === undefined)
        await config.updateValue("serverId", speedtest.server.id);

    if (Object.keys(speedtest).length === 0) throw {message: "No response, even after trying again, test timed out."};

    return speedtest;
}

module.exports.create = async (type = "auto", retried = false) => {
    if (await config.getValue("acceptOoklaLicense") === 'false') return;
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
        setRunning(false);
        sendFinished({ping, download, upload, time}).then(() => "");
    } catch (e) {
        if (!retried) return this.create(type, true);
        let testResult = await tests.create(-1, -1, -1, null, type, e.message);
        await sendError(e.message);
        setRunning(false, false);
        console.log(`Test #${testResult} was not executed successfully. Please try reconnecting to the internet or restarting the software: ` + e.message);
    }
}

module.exports.isRunning = () => isRunning;

module.exports.removeOld = async () => {
    await tests.removeOld();
}