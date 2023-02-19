const app = require('express').Router();
const config = require('../controller/config');
const timer = require('../tasks/timer');
const cron = require('cron-validator');
const password = require('../middlewares/password');

// Gets all config entries
app.get("/", password(true), async (req, res) => {
    let configValues = {};
    (await config.list()).forEach(row => {
        if (row.key !== "password" && !(req.viewMode && ["healthChecksUrl", "serverId", "cron", "passwordLevel"].includes(row.key)))
            configValues[row.key] = row.value;
    });
    configValues['viewMode'] = req.viewMode;

    if (Object.keys(configValues).length === 0) return res.status(404).json({message: "Hmm. There are no config values. Weird..."});
    res.json(configValues);
});

// Updates a specific config entry
app.patch("/:key", password(false), async (req, res) => {
    if (!req.body.value?.toString()) return res.status(400).json({message: "You need to provide the new value"});

    if ((req.params.key === "ping" || req.params.key === "download" || req.params.key === "upload") && isNaN(req.body.value))
        return res.status(400).json({message: "You need to provide a number in order to change this"});

    if (req.params.key === "passwordLevel" && !["none", "read"].includes(req.body.value))
        return res.status(400).json({message: "You need to provide either none or read-access"});

    if (req.params.key === "acceptOoklaLicense" && typeof req.body.value !== "boolean")
        return res.status(400).json({message: "You need to provide a boolean value"});

    if (req.params.key === "ping")
        req.body.value = req.body.value.toString().split(".")[0];

    if (req.params.key === "password" && req.body.value !== "none") req.body.value = await require('bcrypt').hash(req.body.value, 10);

    if (req.params.key === "cron" && !cron.isValidCron(req.body.value.toString()))
        return res.status(500).json({message: "Not a valid cron expression"});

    if (!await config.update(req.params.key, req.body.value.toString())) return res.status(404).json({message: "The provided key does not exist"});

    if (req.params.key === "cron") {
        timer.stopTimer();
        timer.startTimer(req.body.value.toString());
    }

    res.json({message: `The key '${req.params.key}' has been successfully updated`});
});

module.exports = app;