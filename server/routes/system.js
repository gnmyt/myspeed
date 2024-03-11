const app = require('express').Router();
const version = require('../../package.json').version;
const remote_url = "https://api.github.com/repos/gnmyt/myspeed/releases/latest";
const axios = require('axios');
const fs = require("fs");
const password = require('../middlewares/password');

let servers;

app.get("/version", password(false), async (req, res) => {
    if (process.env.PREVIEW_MODE === "true") return res.json({local: version, remote: "0"});

    try {
        res.json({local: version, remote: ((await axios.get(remote_url)).data.tag_name).replace("v", "")});
    } catch (e) {
        res.json({local: version, remote: "0"});
    }
});

app.get("/server", password(false), (req, res) => {
    if (servers) return res.json(JSON.parse(servers));

    if (fs.existsSync("./data/servers.json")) {
        servers = fs.readFileSync("./data/servers.json");
        return res.json(JSON.parse(servers));
    } else {
        return res.json([]);
    }
});

module.exports = app;