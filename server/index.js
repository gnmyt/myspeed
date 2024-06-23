const express = require('express');
const path = require('path');
const timerTask = require('./tasks/timer');
const integrationTask = require('./tasks/integrations');

const app = express();

app.disable('x-powered-by');

const port = process.env.SERVER_PORT || 5216;

require('./util/createFolders');
require('./util/loadServers');

process.on('uncaughtException', err => require('./util/errorHandler')(err));

app.use(express.json());
app.use(require('./middlewares/error'));

app.use("/api/config", require('./routes/config'));
app.use("/api/speedtests", require('./routes/speedtests'));
app.use("/api/info", require('./routes/system'));
app.use("/api/storage", require('./routes/storage'));
app.use("/api/recommendations", require('./routes/recommendations'));
app.use("/api/nodes", require('./routes/nodes'));
app.use("/api/integrations", require('./routes/integrations'));
app.use("/api/prometheus", require('./routes/prometheus'));
app.use('/api/opengraph', require('./routes/opengraph'));
app.use("/api*", (req, res) => res.status(404).json({message: "Route not found"}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../build', 'index.html')));
} else {
    app.get("*", (req, res) => res.status(500).sendFile(path.join(__dirname, 'templates', 'env.html')));
}

let db = require("./config/database");

const run = async () => {
    const config = require('./controller/config');

    await db.sync({alter: true, force: false});

    await require('./controller/integrations').initialize();

    await require('./util/loadInterfaces').requestInterfaces();
    setInterval(() => require('./util/loadInterfaces').requestInterfaces(), 3600000);

    if (process.env.PREVIEW_MODE !== "true") await require('./util/loadCli').load();

    await config.insertDefaults();

    timerTask.startTimer(await config.getValue("cron"));
    setInterval(async () => require('./tasks/speedtest').removeOld(), 60000);

    integrationTask.startTimer();
    if (process.env.RUN_TEST_ON_STARTUP === "true") {
        timerTask.runTask().then(undefined);
    }

    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

db.authenticate().then(() => {
    console.log("Successfully connected to the database " + (process.env.DB_TYPE === "mysql" ? "server" : "file"));
    run().then(undefined);
}).catch(err => {
    console.error("Could not open the database file. Maybe it is damaged?: " + err.message);
    process.exit(111);
});