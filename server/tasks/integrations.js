const schedule = require('node-schedule');
const {triggerEvent} = require("../controller/integrations");

let currentState = "ping";
let job;

module.exports.setState = (state = "ping") => {
    currentState = state;
}

module.exports.sendPing = async (type, message) => {
    await triggerEvent("minutePassed", {type, message});
}

module.exports.sendCurrent = async () => {
    if (currentState === "ping") await this.sendPing();
}

module.exports.sendError = async (error = "Unknown error") => {
    await triggerEvent("testFailed", error);
}

module.exports.sendRunning = async () => {
    await triggerEvent("testStarted");
}

module.exports.sendFinished = async (data) => {
    await triggerEvent("testFinished", data);
}

module.exports.startTimer = () => {
    job = schedule.scheduleJob('* * * * *', () => this.sendCurrent());
}

module.exports.stopTimer = () => {
    if (job !== undefined) {
        job.cancel();
        job = undefined;
    }
}