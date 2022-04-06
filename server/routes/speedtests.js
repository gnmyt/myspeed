const app = require('express').Router();

app.get("/", (req, res) => {
    // TODO: Show all speedtests from the database
});

app.get("/latest", (req, res) => {
   // TODO: Show the latest speedtest
});

app.get("/:id", (req, res) => {
    // TODO: Shows a specific speedtest by id
});

app.delete("/api/speedtests/:id", (req, res) => {
    // TODO: Delete a speedtest by id
});

module.exports = app;