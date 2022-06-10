const app = require('express').Router();
const tests = require('../controller/speedtests');


app.get("/json", async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"speedtests.json\""});
    res.send(JSON.stringify(tests.list(), null, 4));
});

app.get("/csv", async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"speedtests.csv\""});
    let list = tests.list();
    let fields = Object.keys(list[0]);

    let replacer = (key, value) => value === null ? '' : value

    let csv = list.map(row => fields.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(fields.join(','))
    csv = csv.join('\r\n');

    res.send(csv);
});

module.exports = app;