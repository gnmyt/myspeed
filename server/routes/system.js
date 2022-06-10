const app = require('express').Router();
const version = require('../../package.json').version;
const remote_url = "https://raw.githubusercontent.com/gnmyt/myspeed/release/package.json";
const axios = require('axios');


app.get("/version", async (req, res) => {
    res.json({local: version, remote: (await axios.get(remote_url)).data.version});
});

module.exports = app;