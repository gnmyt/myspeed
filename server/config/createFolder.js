const fs = require('fs');

if (!fs.existsSync("data")) {
    try {
        fs.mkdirSync("data", {recursive: true});
    } catch (e) {
        console.error("Could not create the data folder. Please check the permission");
        process.exit(0);
    }
}