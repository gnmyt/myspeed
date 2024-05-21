const tests = require('../models/Speedtests');
const {Op, Sequelize} = require("sequelize");
const {mapFixed, mapRounded, calculateTestAverages} = require("../util/helpers");

module.exports.create = async (ping, download, upload, time, serverId, type = "auto", resultId = null, error = null) => {
    return (await tests.create({ping, download, upload, error, serverId, type, resultId, time, created: new Date().toISOString()})).id;
}

module.exports.getOne = async (id) => {
    let speedtest = await tests.findByPk(id);
    if (speedtest === null) return null;
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

module.exports.listAll = async () => {
    let dbEntries = await tests.findAll({order: [["created", "DESC"]]});
    for (let dbEntry of dbEntries) {
        if (dbEntry.error === null) delete dbEntry.error;
        if (dbEntry.resultId === null) delete dbEntry.resultId;
    }

    return dbEntries;
}

module.exports.listTests = async (hours = 24, start, limit) => {
    limit = parseInt(limit) || 10;
    const whereClause = start ? {id: {[Op.lt]: start}} : undefined;

    let dbEntries = (await tests.findAll({where: whereClause, order: [["created", "DESC"]], limit}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - hours * 3600000);

    for (let dbEntry of dbEntries) {
        if (dbEntry.error === null) delete dbEntry.error;
        if (dbEntry.resultId === null) delete dbEntry.resultId;
    }

    return dbEntries;
}

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

module.exports.listAverage = async (days) => {
    const averages = await this.listByDays(days);
    let result = [];

    if (Object.keys(averages).length !== 0)
        result.push(averages[Object.keys(averages)[0]][0]);

    for (let day in averages) {
        let currentDay = averages[day];
        let avgNumbers = calculateTestAverages(currentDay);

        const created = new Date(currentDay[0].created);
        result.push({
            ping: Math.round(avgNumbers["ping"]),
            download: parseFloat((avgNumbers["down"]).toFixed(2)),
            upload: parseFloat((avgNumbers["up"]).toFixed(2)),
            time: Math.round(avgNumbers["time"]),
            type: "average",
            amount: currentDay.length,
            created: created.toISOString()
        });
    }

    return result;
}

module.exports.deleteTests = async () => {
    await tests.destroy({where: {}});
    return true;
}

module.exports.importTests = async (data) => {
    if (!Array.isArray(data)) return false;

    for (let entry of data) {
        if (entry.error === null) delete entry.error;
        if (entry.resultId === null) delete entry.resultId;
        try {
            await tests.create(entry);
        } catch (e) {
        }
    }

    return true;
}

module.exports.listStatistics = async (days) => {
    let dbEntries = (await tests.findAll({order: [["created", "DESC"]]}))
        .filter((entry) => new Date(entry.created) > new Date().getTime() - (days <= 30 ? days : 30 ) * 24 * 3600000);

    let avgEntries = [];
    if (days >= 3) avgEntries = await this.listAverage(days);

    let notFailed = dbEntries.filter((entry) => entry.error === null);

    let data = {};
    ["ping", "download", "upload", "time"].forEach(item => {
        data[item] = days >= 3 ? avgEntries.map(entry => entry[item]) : notFailed.map(entry => entry[item]);
    });


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
        data,
        labels: days >= 3 ? avgEntries.map((entry) => new Date(entry.created).toISOString())
            : notFailed.map((entry) => new Date(entry.created).toISOString())
    };
}

module.exports.deleteOne = async (id) => {
    if (await this.getOne(id) === null) return false;
    await tests.destroy({where: {id: id}});
    return true;
}

module.exports.removeOld = async () => {
    await tests.destroy({
        where: {
            created: process.env.DB_TYPE === "mysql"
                ? {[Op.lte]: new Date(new Date().getTime() - 30 * 24 * 3600000)} // MySQL
                : {[Op.lte]: Sequelize.literal(`datetime('now', '-30 days')`)} // SQLite
        }
    });
    return true;
}