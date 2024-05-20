const app = require('express').Router();
const tests = require('../controller/speedtests');
const config = require('../controller/config');
const password = require('../middlewares/password');

app.get("/", password(false), async (req, res) => {
    res.json(await config.getUsedStorage());
});

app.get("/tests/history/json", password(false), async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"speedtests.json\""});
    res.send(JSON.stringify(await tests.listAll(), null, 4));
});

app.get("/tests/history/csv", password(false), async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"speedtests.csv\""});
    let list = await tests.listAll();

    if (list.length === 0) return res.send("");
    let fields = Object.keys(list[0]);

    let replacer = (key, value) => value === null ? '' : value;

    let csv = list.map(row => fields.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift('"' + fields.join('","') + '"');
    csv = csv.join('\r\n');

    res.send(csv);
});

app.delete("/tests/history", password(false), async (req, res) => {
    let result = await tests.deleteTests();
    res.status(result ? 200 : 500).json({message: result ? "Tests deleted" : "Error deleting tests"});
});

app.put("/tests/history", password(false), async (req, res) => {
    let result = await tests.importTests(req.body);
    res.status(result ? 200 : 500).json({message: result ? "Tests imported" : "Error importing tests"});
});

app.get("/config", password(false), async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"config.json\""});
    config.exportConfig().then(obj => res.json(obj));
});

app.put("/config", password(false), async (req, res) => {
    let result = await config.importConfig(req.body);
    res.status(result ? 200 : 500).json({message: result ? "Config imported" : "Error importing config"});
});

app.delete("/config", password(false), async (req, res) => {
    let result = await config.factoryReset();
    res.status(result ? 200 : 500).json({message: result ? "Config reset" : "Error resetting config"});
});

module.exports = app;