const app = require('express').Router();
const tests = require('../controller/speedtests');

// List all speedtests
app.get("/", (req, res) => {
    res.json(tests.list());
});

// List only the latest speedtest
app.get("/latest", (req, res) => {
    res.json(tests.latest());
});

// Get a specific speedtest
app.get("/:id", (req, res) => {
    let test = tests.get(req.params.id);
    if (test === undefined) res.status(404).json({message: "Speedtest not found"});
    res.json(test);
});

// Delete a specific speedtest
app.delete("/:id", (req, res) => {
    let test = tests.delete(req.params.id);
    if (test === undefined) return res.status(404).json({message: "Speedtest not found"});
    res.json({message: "Successfully deleted the provided speedtest"});
});

module.exports = app;