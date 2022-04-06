const app = require('express').Router();
const config = require('../controller/config');

// Gets all config entries
app.get("/", (req, res) => {
    let configValues = {};
    config.list().forEach(row => {
        if (row.key !== "password") configValues[row.key] = row.value;
    });
    if (Object.keys(configValues).length === 0) return res.status(404).json({message: "Hmm. There are no config values. Weird..."});
    res.json(configValues);
});

// Gets a specific config entry
app.get("/:key", (req, res) => {
    let row = config.get(req.params.key);
    if (row.key === "password") return res.status(403).json({message: "Really?"});
    res.json({key: row.key, value: row.value});
});

// Updates a specific config entry
app.patch("/:key", async (req, res) => {
    if (!req.body.value) return res.status(400).json({message: "You need to provide the new value"});

    if (req.params.key === "password" && req.body.value !== "none") req.body.value = await require('bcrypt').hash(req.body.value, 10);

    if (!config.update(req.params.key, req.body.value)) return res.status(404).json({message: "The provided key does not exist"});
    res.json({message: `The key '${req.params.key}' has been successfully updated`});
});

module.exports = app;