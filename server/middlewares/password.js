const config = require('../controller/config');
const bcrypt = require('bcrypt');

module.exports = (allowViewAccess) => async (req, res, next) => {
    if (process.env.PREVIEW_MODE === "true") return next();

    let passwordHash = await config.getValue("password");
    let passwordLevel = await config.getValue("passwordLevel");

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