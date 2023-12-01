const app = require('express').Router();
const tests = require('../controller/speedtests');
const password = require('../middlewares/password');

app.get("/json", password(false), async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"speedtests.json\""});
    res.send(JSON.stringify(await tests.listTests(), null, 4));
});

app.get("/csv", password(false), async (req, res) => {
    res.set({"Content-Disposition": "attachment; filename=\"speedtests.csv\""});
    let list = await tests.listTests();

    if (list.length === 0) return res.send("");
    let fields = Object.keys(list[0]);

    let replacer = (key, value) => value === null ? '' : value;

    let csv = list.map(row => fields.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift('"' + fields.join('","') + '"');
    csv = csv.join('\r\n');

    res.send(csv);
});

module.exports = app;