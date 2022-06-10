const pauseController = require('../controller/pause');
const schedule = require('node-schedule');

let job;

module.exports.startTimer = () => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = 0

    job = schedule.scheduleJob(rule, () => this.runTask());
}

module.exports.runTask = async () => {
    if (pauseController.currentState) {
        console.warn("Speedtests currently paused. Trying again later...");
        return;
    }

    await require('../tasks/speedtest').create("auto");
}

module.exports.stopTimer = () => {
    job.gracefulShutdown();
}

module.exports.job = job;