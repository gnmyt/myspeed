const app = require('express').Router();
const config = require('../controller/config');
const timer = require('../tasks/timer');
const cron = require('cron-validator');
const password = require('../middlewares/password');

app.get("/", password(true), async (req, res) => {
    let configValues = {};
    (await config.listAll()).forEach(row => {
        if (row.key !== "password" && !(req.viewMode && ["serverId", "cron", "passwordLevel"].includes(row.key)))
            configValues[row.key] = row.value;
        if (process.env.PREVIEW_MODE === "true" && row.key === "acceptOoklaLicense")
            configValues[row.key] = true;
    });
    configValues['viewMode'] = req.viewMode;
    configValues['previewMode'] = process.env.PREVIEW_MODE === "true";

    if (Object.keys(configValues).length === 0) return res.status(404).json({message: "Hmm. There are no config values. Weird..."});
    res.json(configValues);
});

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

    if (!await config.updateValue(req.params.key, req.body.value.toString()))
        return res.status(404).json({message: "The provided key does not exist"});

    if (process.env.PREVIEW_MODE === "true" && req.params.key === "acceptOoklaLicense")
        return res.status(403).json({message: "You can't change the Ookla license acceptance in preview mode"});

    if (process.env.PREVIEW_MODE === "true" && (req.params.key === "password" || req.params.key === "passwordLevel"))
        return res.status(403).json({message: "You can't change the password in preview mode"});

    if (req.params.key === "cron") {
        timer.stopTimer();
        timer.startTimer(req.body.value.toString());
    }

    res.json({message: `The key '${req.params.key}' has been successfully updated`});
});

module.exports = app;