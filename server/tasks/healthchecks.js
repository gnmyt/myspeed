const axios = require("axios");
const config = require('../controller/config');
const schedule = require('node-schedule');

let currentState = "ping";
let job;

// Sets the current state (running = no pings, ping = send pings)
module.exports.setState = (state = "ping") => {
    currentState = state;
}

// Get the current health checks url from the config & format it
const getHealthChecksUrl = async () => {
    let url = (await config.get("healthChecksUrl")).value.toString();
    if (url.includes("<uuid>")) return null;
    if (url.endsWith("/")) url = url.substring(0, url.length - 1);

    return url;
}

// Send a ping to the provided healthcheck server
module.exports.sendPing = async (path, message) => {
    let url = await getHealthChecksUrl();
    if (url == null) return;
    if (path) url += "/" + path;

    try {
        const response = await axios.post(url, message, {headers: {"user-agent": "MySpeed/HealthAgent"}});
        if (response.data.includes("not found")) await config.resetDefault("healthChecksUrl");
    } catch (e) {
        console.error("Could not send ping: " + e.message);
    }
}

// Sends a ping only if the ping state is active
module.exports.sendCurrent = async () => {
    if (currentState === "ping") await this.sendPing();
}

// Sends an error to the healthcheck server
module.exports.sendError = async (error = "Unknown error") => {
    await this.sendPing("fail", error);
}

// Sends a 'running' ping to the healthcheck server
module.exports.sendRunning = async () => {
    await this.sendPing("start");
}

// Starts a timer which sends a ping every minute
module.exports.startTimer = () => {
    job = schedule.scheduleJob('* * * * *', () => this.sendCurrent());
}