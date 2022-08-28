let currentState = "ping";

// Sets the current state (running = no pings, ping = send pings)
module.exports.setState = (state = "ping") => {
    currentState = state;
}