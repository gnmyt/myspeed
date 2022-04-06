const config = require('../controller/config');
const bcrypt = require('bcrypt');

module.exports = (req, res, next) => {
    let passwordHash = config.get("password").value;

    if (passwordHash === "none")
        return next();

    if (!req.headers.password)
        return res.status(401).json({message: "Please provide the correct password in the header"});

    if (!bcrypt.compareSync(req.headers.password, passwordHash))
        return res.status(401).json({message: "Please provide the correct password in the header"});

    next();
}