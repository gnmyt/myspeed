const config = require('../controller/config');

let currentState = "ping";

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