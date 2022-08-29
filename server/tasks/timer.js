const pauseController = require('../controller/pause');
const schedule = require('node-schedule');
const {isValidCron} = require("cron-validator");

let job;

module.exports.startTimer = (cron) => {
    if (!isValidCron(cron)) return;
    job = schedule.scheduleJob(cron, () => this.runTask());
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