const db = require('../index').database;

// Lists all config entries
module.exports.list = () => {
    return db.prepare("SELECT * FROM config").all();
}

// Gets a specific config entry
module.exports.get = (key) => {
    return db.prepare("SELECT * FROM config WHERE key = ?").get(key);
}

// Updates a specific config entry
module.exports.update = (key, newValue) => {
    if (this.get(key) === undefined) return undefined;
    return db.prepare("UPDATE config SET value = ? WHERE key = ?").run(newValue, key);
}