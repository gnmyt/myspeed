const express = require('express');
const path = require('path');
const timerTask = require('./tasks/timer');
const integrationTask = require('./tasks/integrations');

const app = express();

app.disable('x-powered-by');

const port = process.env.port || 5216;

// Create the data folder and the servers file
require('./config/createFolder');
require('./config/loadServers');

process.on('uncaughtException', err => require('./config/errorHandler')(err));

// Register middlewares
app.use(express.json());
app.use(require('./middlewares/error'));

// Register routes
app.use("/api/config", require('./routes/config'));
app.use("/api/speedtests", require('./routes/speedtests'));
app.use("/api/info", require('./routes/system'));
app.use("/api/export", require('./routes/export'));
app.use("/api/recommendations", require('./routes/recommendations'));
app.use("/api/nodes", require('./routes/nodes'));
app.use("/api/integrations", require('./routes/integrations'));
app.use("/api*", (req, res) => res.status(404).json({message: "Route not found"}));

// Enable production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));

    app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../build', 'index.html')));
} else {
    app.get("*", (req, res) => res.status(500).send("<h2>Diese MySpeed-Instanz befindet sich aktuell im Entwicklungsmodus.<br/><br/>"
        + "Wenn du der Betreiber bist, bitte ändere deine Umgebungsvariable ab.</h2>"));
}

// Connect to the database
let db = require("./config/database");

const run = async () => {
    const config = require('./controller/config');

    // Sync the database
    await db.sync({alter: true, force: false});

    // Load the integrations
    await require('./controller/integrations').initialize();

    // Load the cli
    await require('./config/loadCli').load();

    await config.insertDefaults();

    // Start all timer
    timerTask.startTimer((await config.get("cron")).value);
    setInterval(async () => require('./tasks/speedtest').removeOld(), 60000);

    // Start integration interval
    integrationTask.startTimer();

    // Make a speedtest
    timerTask.runTask();

    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

db.authenticate().then(() => {
    console.log("Successfully connected to the database file");
    run();
}).catch(err => {
    console.error("Could not open the database file. Maybe it is damaged?: " + err.message);
    process.exit(111);
});