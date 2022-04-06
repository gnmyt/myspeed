const app = require('express').Router();

app.get("/", (req, res) => {
    // TODO: Show all config values except the password
});

app.get("/:key", (req, res) => {
    // TODO: Shows a specific configuration value by key
});

app.patch("/:key", (req, res) => {
    // TODO: Updates a specific configuration value by key
});

module.exports = app;