let currentState = false;
let updateTimer;

// Update the current state directly
module.exports.updateState = function(newState) {
    this.currentState = newState;
}

// Update the current state in a specific time
module.exports.resumeIn = function(time) {
    if (updateTimer !== null) 
        clearTimeout(updateTimer);

    this.updateState(true);
    updateTimer = setTimeout(() => this.updateState(false), time * 3600000); // time in hours
}

module.exports.currentState = currentState;