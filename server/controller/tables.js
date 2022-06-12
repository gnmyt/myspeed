const db = require('../index').database;

const configDefaults = {
    "setupDone": "true",
    "ping": 25,
    "download": 100,
    "upload": 50,
    "timeLevel": 3,
    "serverId": "none",
    "password": "none"
}

module.exports.create = () => {
    db.exec("create table if not exists config(" +
        "    id    integer primary key autoincrement," +
        "    key   varchar(10)," +
        "    value varchar(255));");
    db.exec("create table if not exists speedtests(" +
        "    id       integer primary key autoincrement," +
        "    ping     integer(5000)," +
        "    download double," +
        "    upload double," +
        "    error varchar(255)," +
        "    type varchar(255)," +
        "    time double," +
        "    created DATETIME DEFAULT CURRENT_TIMESTAMP);");
    db.exec("create table if not exists recommendations(" +
        "    id       integer primary key autoincrement," +
        "    ping     integer(5000)," +
        "    download double," +
        "    upload double);");
}

module.exports.insert = () => {
    if (db.prepare("SELECT value FROM config WHERE key = ?").get("setupDone")) return;

    let statement = db.prepare("INSERT INTO config (key, value) VALUES (?, ?)");
    for (let key in configDefaults) {
        statement.run(key, configDefaults[key]);
    }
}