const fs = require("fs");
let ooklaServers;
let libreServers;

module.exports.getLibreServers = () => {
    if (libreServers) return libreServers;

    if (fs.existsSync("./data/servers/librespeed.json")) {
        libreServers = fs.readFileSync("./data/servers/librespeed.json");
        libreServers = JSON.parse(libreServers);

        return libreServers;
    }

    return [];
}

module.exports.getOoklaServers = () => {
    if (ooklaServers) return ooklaServers;

    if (fs.existsSync("./data/servers/ookla.json")) {
        ooklaServers = fs.readFileSync("./data/servers/ookla.json");
        ooklaServers = JSON.parse(ooklaServers);

        return ooklaServers;
    }

    return [];
}

module.exports.getByMode = (mode) => {
    if (mode === "ookla") return this.getOoklaServers();
    if (mode === "libre") return this.getLibreServers();
}