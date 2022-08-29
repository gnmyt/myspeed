const pauseController = require('../controller/pause');
const schedule = require('node-schedule');

let job;

module.exports.startTimer = (timeLevel) => {
    job = schedule.scheduleJob(getRuleFromLevel(timeLevel), () => this.runTask());
}

module.exports.runTask = async () => {
    if (pauseController.currentState) {
        console.warn("Speedtests currently paused. Trying again later...");
        return;
    }

    await require('./speedtest').create("auto");
}

module.exports.stopTimer = () => {
    if (job !== undefined) {
        job.cancel();
        job = undefined;
    }
}

module.exports.job = job;