const app = require('express').Router();
const config = require('../controller/config');
const timer = require('../tasks/timer');

// Gets all config entries
app.get("/", async (req, res) => {
    let configValues = {};
    (await config.list()).forEach(row => {
        if (row.key !== "password") configValues[row.key] = row.value;
    });
    if (Object.keys(configValues).length === 0) return res.status(404).json({message: "Hmm. There are no config values. Weird..."});
    res.json(configValues);
});

// Gets a specific config entry
app.get("/:key", async (req, res) => {
    let row = await config.get(req.params.key);
    if (row === null) return res.status(404).json({message: "Config value not found"});
    if (row.key === "password") return res.status(403).json({message: "Really?"});
    res.json({key: row.key, value: row.value});
});

// Updates a specific config entry
app.patch("/:key", async (req, res) => {
    if (!req.body.value) return res.status(400).json({message: "You need to provide the new value"});

    if ((req.params.key === "ping" || req.params.key === "download" || req.params.key === "upload" || req.params.key === "timeLevel") && isNaN(req.body.value))
        return res.status(400).json({message: "You need to provide a number in order to change this"});

    if (req.params.key === "ping")
        req.body.value = req.body.value.toString().split(".")[0];

    if (req.params.key === "password" && req.body.value !== "none") req.body.value = await require('bcrypt').hash(req.body.value, 10);

    if (!await config.update(req.params.key, req.body.value)) return res.status(404).json({message: "The provided key does not exist"});

    if (req.params.key === "timeLevel") {
        timer.stopTimer();
        timer.startTimer(req.body.value);
    }

    res.json({message: `The key '${req.params.key}' has been successfully updated`});
});

module.exports = app;