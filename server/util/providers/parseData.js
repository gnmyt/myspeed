const roundSpeed = (bytes, elapsed) => {
    return Math.round((bytes * 8 / elapsed) / 10) / 100;
}

module.exports.parseOokla = (test) => {
    let ping = Math.round(test.ping.latency);
    let download = roundSpeed(test.download.bytes, test.download.elapsed);
    let upload = roundSpeed(test.upload.bytes, test.upload.elapsed);
    let time = Math.round((test.download.elapsed + test.upload.elapsed) / 1000);

    return {ping, download, upload, time};
}

module.exports.parseLibre = (test) => {
    return {ping: test.ping, upload: test.upload, download: test.download, time: Math.round(test.elapsed / 1000)};
}

module.exports.parseCloudflare = async (test) => {
    let ping = Math.round(test.latency);
    let download = Math.round(test.download / 10000) / 100;
    let upload = Math.round(test.upload / 10000) / 100;
    let time = Math.round(test.elapsed / 1000);

    return {ping, download, upload, time};
}

module.exports.parseData = (provider, data) => {
    switch (provider) {
        case "ookla":
            return this.parseOokla(data);
        case "libre":
            return this.parseLibre(data);
        case "cloudflare":
            return this.parseCloudflare(data);
        default:
            throw {message: "Invalid provider"};
    }
}