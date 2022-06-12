const pauseController = require('../controller/pause');
const schedule = require('node-schedule');

let job;

module.exports.startTimer = (timeLevel) => {
    job = schedule.scheduleJob(getRuleFromLevel(timeLevel), () => this.runTask());
}

const getRuleFromLevel = (level) => {
    const rule = new schedule.RecurrenceRule();

    switch (level.value) {
        case "1":
            rule.second = 0;
            break;
        case "2":
            rule.minute = [0, 30]
            break;
        case "3":
            rule.minute = 0;
            break;
        case "4":
            rule.hour = [0, 3, 6, 9, 12, 15, 18, 21];
            break;
        case "5":
            rule.hour = [0, 6, 12, 18];
            break;
    }

    return rule;
}

module.exports.runTask = async () => {
    if (pauseController.currentState) {
        console.warn("Speedtests currently paused. Trying again later...");
        return;
    }

    await require('../tasks/speedtest').create("auto");
}

module.exports.stopTimer = () => {
    if (job !== undefined) {
        job.cancel();
        job = undefined;
    }
}

module.exports.job = job;