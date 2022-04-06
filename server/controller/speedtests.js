const db = require('../index').database;

// Inserts a new speedtest into the database
module.exports.create = (ping, download, upload) => {
    return db.prepare("INSERT INTO speedtests (ping, download, upload) VALUES (?, ?, ?)").run(ping, download, upload).lastInsertRowid;
}

// Gets a specific speedtest by id
module.exports.get = (id) => {
    return db.prepare("SELECT * FROM speedtests WHERE id = ?").get(id);
}

// Lists all speedtests from the database
module.exports.list = () => {
    return db.prepare("SELECT * FROM speedtests").all();
}

// Gets the latest speedtest from the database
module.exports.latest = () => {
    return db.prepare("SELECT * FROM speedtests ORDER BY id DESC").get();
}

// Deletes a specific speedtest
module.exports.delete = (id) => {
    if (this.get(id) === undefined) return undefined;
    db.prepare("DELETE FROM speedtests WHERE id = ?").run(id);
    return true;
}