const fs = require('fs');

const neededFolder = ["data", "bin", "data/logs", "data/servers"];

neededFolder.forEach(folder => {
    if (!fs.existsSync(folder)) {
        try {
            fs.mkdirSync(folder, {recursive: true});
        } catch (e) {
            console.error("Could not create the data folder. Please check the permission");
            process.exit(0);
        }
    }
});