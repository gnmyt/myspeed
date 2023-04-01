const tests = require('../models/Speedtests');
const {Op, Sequelize} = require("sequelize");

// Inserts a new speedtest into the database
module.exports.create = async (ping, download, upload, time, type = "auto", error = null) => {
    return (await tests.create({ping, download, upload, error, type, time})).id;
}

// Gets a specific speedtest by id
module.exports.get = async (id) => {
    let speedtest = await tests.findByPk(id);
    if (speedtest === null) return null;
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Lists all speedtests from the database
module.exports.list = async (hours = 24, start, limit) => {
    const whereClause = start ? {id: {[Op.lt]: start}} : undefined;

    let dbEntries = (await tests.findAll({where: whereClause, order: [["created", "DESC"]], limit}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - hours * 3600000);

    for (let dbEntry of dbEntries)
        if (dbEntry.error === null) delete dbEntry.error

    return dbEntries;
}

// Lists all speedtests from the database grouped by days
module.exports.listByDays = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]})).filter((entry) => entry.error === null)
        .filter((entry) => new Date(entry.created) > new Date().getTime() - days * 24 * 3600000);

    let averages = {};
    dbEntries.forEach((entry) => {
        const day = new Date(entry.created).toLocaleDateString();
        if (!averages[day]) averages[day] = [];
        averages[day].push(entry);
    });

    return averages;
}

// Calculates the average speedtests and lists them
module.exports.listAverage = async (days) => {
    const averages = await this.listByDays(days);
    let result = [];

    if (Object.keys(averages).length !== 0)
        result.push(averages[Object.keys(averages)[0]][0]);

    for (let day in averages) {
        let avgNumbers = {ping: 0, down: 0, up: 0, time: 0};
        let currentDay = averages[day];

        currentDay.forEach((current) => {
            avgNumbers.ping += current.ping;
            avgNumbers.down += current.download;
            avgNumbers.up += current.upload;
            avgNumbers.time += current.time;
        });

        const created = new Date(currentDay[0].created);
        result.push({
            ping: Math.round(avgNumbers["ping"] / currentDay.length),
            download: parseFloat((avgNumbers["down"] / currentDay.length).toFixed(2)),
            upload: parseFloat((avgNumbers["up"] / currentDay.length).toFixed(2)),
            time: Math.round(avgNumbers["time"] / currentDay.length),
            type: "average",
            amount: currentDay.length,
            created: created.getFullYear() + "-" + (created.getMonth() + 1) + "-" + created.getDate()
        });
    }

    return result;
}

const mapFixed = (entries, type) => ({
    min: Math.min(...entries.map((entry) => entry[type])),
    max: Math.max(...entries.map((entry) => entry[type])),
    avg: parseFloat((entries.reduce((a, b) => a + b[type], 0) / entries.length).toFixed(2))
});

const mapRounded = (entries, type) => ({
    min: Math.min(...entries.map((entry) => entry[type])),
    max: Math.max(...entries.map((entry) => entry[type])),
    avg: Math.round(entries.reduce((a, b) => a + b[type], 0) / entries.length)
});

module.exports.listStatistics = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - (days <= 30 ? days : 30 ) * 24 * 3600000);

    let avgEntries = [];
    if (days >= 3) avgEntries = await this.listAverage(days);

    let notFailed = dbEntries.filter((entry) => entry.error === null);

    return {
        tests: {
            total: dbEntries.length,
            failed: dbEntries.length - notFailed.length,
            custom: dbEntries.filter((entry) => entry.type === "custom").length
        },
        ping: mapRounded(notFailed, "ping"),
        download: mapFixed(notFailed, "download"),
        upload: mapFixed(notFailed, "upload"),
        time: mapRounded(notFailed, "time"),
        data: {
            ping: days >= 3 ? avgEntries.map((entry) => entry.ping) : notFailed.map((entry) => entry.ping),
            download: days >= 3 ? avgEntries.map((entry) => entry.download) : notFailed.map((entry) => entry.download),
            upload: days >= 3 ? avgEntries.map((entry) => entry.upload) : notFailed.map((entry) => entry.upload),
            time: days >= 3 ? avgEntries.map((entry) => entry.time) : notFailed.map((entry) => entry.time)
        },
        labels: days >= 3 ? avgEntries.map((entry) => new Date(entry.created).toLocaleDateString())
            : notFailed.map((entry) => new Date(entry.created).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}))
    };
}

// Gets the latest speedtest from the database
module.exports.latest = async () => {
    let speedtest = await tests.findOne({order: [["created", "DESC"]]});
    if (speedtest != null && speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Deletes a specific speedtest
module.exports.delete = async (id) => {
    if (await this.get(id) === null) return false;
    await tests.destroy({where: {id: id}});
    return true;
}

// Removes speedtests older than 30 days
module.exports.removeOld = async () => {
    await tests.destroy({
        where: {
            created: {
                [Op.lte]: Sequelize.literal(`datetime('now', '-30 days')`)
            }
        }
    });
    return true;
}