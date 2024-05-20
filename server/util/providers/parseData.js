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

module.exports.parseLibre = (test) => ({...test, time: Math.round(test.elapsed / 1000)});

module.exports.parseCloudflare = (test) => ({...test, time: Math.round(test.elapsed)});

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