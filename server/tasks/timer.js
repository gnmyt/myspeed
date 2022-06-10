const pauseController = require('../controller/pause');

let newDate = new Date();
let timer;

module.exports.startTimer = () => {
    if (timer != null) this.stopTimer();

    if (newDate.getMinutes() === 0) {
        this.runTask();
    } else {
        newDate.setHours(newDate.getHours() + 1);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
    
        var difference = newDate - new Date();
        timer = setTimeout(this.runTask, difference);
    }
}

module.exports.runTask = async () => {
    if (pauseController.currentState) {
        console.warn("Speedtests currently paused. Trying again later...");
        return;
    }

    await require('../tasks/speedtest').create();
}

module.exports.stopTimer = () => {
    if (timer != null)
        clearTimeout(timer);
    
    timer = null;
}

module.exports.timer = timer;