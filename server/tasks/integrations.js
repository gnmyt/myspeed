const schedule = require('node-schedule');
const {triggerEvent} = require("../controller/integrations");

let currentState = "ping";
let job;

// Sets the current state (running = no pings, ping = send pings)
module.exports.setState = (state = "ping") => {
    currentState = state;
}

// Send a ping to the provided healthcheck server
module.exports.sendPing = async (type, message) => {
    await triggerEvent("minutePassed", {type, message});
}

// Sends a ping only if the ping state is active
module.exports.sendCurrent = async () => {
    if (currentState === "ping") await this.sendPing();
}

// Sends an error to the healthcheck server
module.exports.sendError = async (error = "Unknown error") => {
    await triggerEvent("testFailed", error);
}

// Sends a 'running' ping to the healthcheck server
module.exports.sendRunning = async () => {
    await triggerEvent("testStarted");
}

module.exports.sendFinished = async (data) => {
    await triggerEvent("testFinished", data);
}

// Starts a timer which sends a ping every minute
module.exports.startTimer = () => {
    job = schedule.scheduleJob('* * * * *', () => this.sendCurrent());
}

// Stops the timer
module.exports.stopTimer = () => {
    if (job !== undefined) {
        job.cancel();
        job = undefined;
    }
}