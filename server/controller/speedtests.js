const db = require('../index').database;

// Inserts a new speedtest into the database
module.exports.create = (ping, download, upload, time, type = "auto", error = null) => {
    return db.prepare("INSERT INTO speedtests (ping, download, upload, created, error, time, type) VALUES (?, ?, ?, ?, ?, ?, ?)").run(ping, download, upload,
        new Date().toISOString(), error, time, type).lastInsertRowid;
}

// Gets a specific speedtest by id
module.exports.get = (id) => {
    let speedtest = db.prepare("SELECT * FROM speedtests WHERE id = ?").get(id);
    if (speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Lists all speedtests from the database
module.exports.list = () => {
    let dbEntries = db.prepare("SELECT * FROM speedtests ORDER BY created DESC").all();
    let all = [];

    dbEntries.forEach((entry) => {
        if (entry.error === null) delete entry.error
        all.push(entry);
    });

    return all;
}

// Gets the latest speedtest from the database
module.exports.latest = () => {
    let speedtest = db.prepare("SELECT * FROM speedtests ORDER BY id DESC").get();
    if (speedtest != null && speedtest.error === null) delete speedtest.error;
    return speedtest
}

// Deletes a specific speedtest
module.exports.delete = (id) => {
    if (this.get(id) === undefined) return undefined;
    db.prepare("DELETE FROM speedtests WHERE id = ?").run(id);
    return true;
}

// Removes speedtests older than 24 hours
module.exports.removeOld = () => {
    db.prepare("DELETE FROM speedtests WHERE created <= date('now','-1 day')").run();
    return true;
}