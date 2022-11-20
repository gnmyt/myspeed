const config = require('../controller/config');
const bcrypt = require('bcrypt');

module.exports = (allowViewAccess) => async (req, res, next) => {
    let passwordHash = (await config.get("password")).value;
    let passwordLevel = (await config.get("passwordLevel")).value;

    if (passwordHash === "none") {
        req.viewMode = false;
        return next();
    }

    if (req.headers.password && bcrypt.compareSync(req.headers.password, passwordHash)) {
        req.viewMode = false;
        return next();
    }

    if (passwordLevel === "read" && allowViewAccess) {
        req.viewMode = true;
        return next();
    }

    return res.status(401).json({message: "Please provide the correct password in the header"});
}