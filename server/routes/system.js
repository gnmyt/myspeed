const app = require('express').Router();
const version = require('../../package.json').version;
const remote_url = "https://api.github.com/repos/gnmyt/myspeed/releases/latest";
const axios = require('axios');
const password = require('../middlewares/password');
const serverController = require('../controller/servers');

app.get("/version", password(false), async (req, res) => {
    if (process.env.PREVIEW_MODE === "true") return res.json({local: version, remote: "0"});

    try {
        res.json({local: version, remote: ((await axios.get(remote_url)).data.tag_name).replace("v", "")});
    } catch (e) {
        res.json({local: version, remote: "0"});
    }
});

app.get("/server/:provider", password(false), (req, res) => {
    if (!["ookla", "libre"].includes(req.params.provider))
        return res.status(400).json({message: "Invalid provider"});

    res.json(serverController.getByMode(req.params.provider));
});

module.exports = app;