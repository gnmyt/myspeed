let currentState = false;
let updateTimer;

module.exports.updateState = (newState) => {
    this.currentState = newState;
}

module.exports.resumeIn = (hours) => {
    if (/[^0-9]/.test(hours)) return false;


    if (updateTimer !== null) 
        clearTimeout(updateTimer);

    this.updateState(true);
    updateTimer = setTimeout(() => this.updateState(false), hours * 3600000); // time in hours

    return true;
}

module.exports.currentState = currentState;