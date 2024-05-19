const fs = require('fs');
const {get} = require('https');
const decompress = require("decompress");
const {file} = require("tmp");
const decompressTarGz = require('decompress-targz');
const decompressUnzip = require('decompress-unzip');
const binaries = require('../../config/binaries');

const binaryRegex = /librespeed-cli(.exe)?$/;
const binaryDirectory = __dirname + "/../../../bin/";
const binaryPath = `${binaryDirectory}/librespeed-cli` + (process.platform === "win32" ? ".exe" : "");

const downloadPath = `https://github.com/librespeed/speedtest-cli/releases/download/v${binaries.libreVersion}/librespeed-cli_${binaries.libreVersion}_`;

module.exports.fileExists = async () => fs.existsSync(binaryPath);

module.exports.downloadFile = async () => {
    const binary = binaries.libreList.find(b => b.os === process.platform && b.arch === process.arch);

    if (!binary)
        throw new Error(`Your platform (${process.platform}-${process.arch}) is not supported by the LibreSpeed CLI`);

    await new Promise((resolve) => {
        file({postfix: binary.suffix}, async (err, path) => {
            const location = await new Promise((resolve) => get(downloadPath + binary.suffix, (res) => {
                resolve(res.headers.location);
            }));

            get(location, async resp => {
                resp.pipe(fs.createWriteStream(path)).on('finish', async () => {
                    await decompress(path, binaryDirectory, {
                        plugins: [decompressTarGz(), decompressUnzip()],
                        filter: file => binaryRegex.test(file.path),
                        map: file => {
                            file.path = "librespeed-cli" + (process.platform === "win32" ? ".exe" : "");
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
    if (!await this.fileExists())
        await this.downloadFile();
}