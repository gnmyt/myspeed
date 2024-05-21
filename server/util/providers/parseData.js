const roundSpeed = (bandwidth) => {
    return Math.round(bandwidth / 1250) / 100;
}

module.exports.parseOokla = (test) => {
    let ping = Math.round(test.ping.latency);
    let download = roundSpeed(test.download.bandwidth);
    let upload = roundSpeed(test.upload.bandwidth);
    let time = Math.round((test.download.elapsed + test.upload.elapsed) / 1000);

    return {ping, download, upload, time, resultId: test.result.id};
}

module.exports.parseLibre = (test) => ({...test, ping: Math.round(test.ping), time: Math.round(test.elapsed / 1000),
    resultId: null});

module.exports.parseCloudflare = (test) => ({...test, time: Math.round(test.elapsed), resultId: null});

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