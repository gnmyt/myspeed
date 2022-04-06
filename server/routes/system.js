const app = require('express').Router();
const version = require('../../package.json').version;

app.get("/version", (req, res) => {
    res.send("MySpeed Server version " + version);
});

module.exports = app;