const fs = require('fs');
const {get} = require('https');
const decompress = require("decompress");
const {file} = require("tmp");
const decompressTarGz = require('decompress-targz');
const decompressUnzip = require('decompress-unzip');
const binaries = require('./binaries');

const binaryRegex = /speedtest(.exe)?$/;
const binaryDirectory = __dirname + "/../../bin/";
const binaryPath = `${binaryDirectory}/speedtest`;

const downloadPath = `https://install.speedtest.net/app/cli/ookla-speedtest-${binaries.version}-`;

module.exports.checkFile = async () => fs.existsSync(binaryPath);

module.exports.downloadFile = async () => {
    const binary = binaries.list.find(b => b.os === process.platform && b.arch === process.arch);

    if (!binary)
        throw new Error(`Your platform (${process.platform}-${process.arch}) is not supported by the Speedtest CLI`);

    await new Promise((resolve) => {
        file({postfix: binary.suffix}, async (err, path) => {
            get(downloadPath + binary.suffix, async resp => {
                resp.pipe(fs.createWriteStream(path)).on('finish', async () => {
                    await decompress(path, binaryDirectory, {
                        plugins: [decompressTarGz(), decompressUnzip()],
                        filter: file => binaryRegex.test(file.path),
                        map: file => {
                            file.path = "speedtest";
                            return file;
                        }
                    });
                    resolve();
                });
            });
        });
    });
}

module.exports.load = async () => {
    if (!await this.checkFile())
        await this.downloadFile();
}