const app = require('express').Router();
const version = require('../../package.json').version;
const remote_url = "https://api.github.com/repos/gnmyt/myspeed/releases/latest";
const axios = require('axios');
const fs = require("fs");


app.get("/version", async (req, res) => {
    try {
        res.json({local: version, remote: (await axios.get(remote_url)).data.tag_name});
    } catch (e) {
        res.json({local: version, remote: "0"});
    }
});

app.get("/server", (req, res) => {
    res.json(JSON.parse(fs.readFileSync("./data/servers.json").toString()));
});

module.exports = app;