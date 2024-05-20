/**
 *
 * This file is part of speed-cloudflare-cli (https://github.com/KNawm/speed-cloudflare-cli),
 * which is released under the MIT License.
 *
 * This file has been modified to be used inside MySpeed.
 *
 * Copyright (c) 2020 Tomás Arias
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const { performance } = require("perf_hooks");
const https = require("https");

function average(values) {
    let total = 0;

    for (let i = 0; i < values.length; i += 1) {
        total += values[i];
    }

    return total / values.length;
}

function median(values) {
    const half = Math.floor(values.length / 2);

    values.sort((a, b) => a - b);

    if (values.length % 2) return values[half];

    return (values[half - 1] + values[half]) / 2;
}

function quartile(values, percentile) {
    values.sort((a, b) => a - b);
    const pos = (values.length - 1) * percentile;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (values[base + 1] !== undefined) {
        return values[base] + rest * (values[base + 1] - values[base]);
    }

    return values[base];
}

function jitter(values) {
    // Average distance between consecutive latency measurements...
    let jitters = [];

    for (let i = 0; i < values.length - 1; i += 1) {
        jitters.push(Math.abs(values[i] - values[i+1]));
    }

    return average(jitters);
}

function request(options, data = "") {
    let started;
    let dnsLookup;
    let tcpHandshake;
    let sslHandshake;
    let ttfb;
    let ended;

    options.agent = new https.Agent(options);

    return new Promise((resolve, reject) => {
        started = performance.now();
        const req = https.request(options, (res) => {
            res.once("readable", () => {
                ttfb = performance.now();
            });
            res.on("data", () => {});
            res.on("end", () => {
                ended = performance.now();
                resolve([started, dnsLookup, tcpHandshake, sslHandshake, ttfb, ended, parseFloat(res.headers["server-timing"].slice(22))]);
            });
        });

        req.on("socket", (socket) => {
            socket.on("lookup", () => {
                dnsLookup = performance.now();
            });
            socket.on("connect", () => {
                tcpHandshake = performance.now();
            });
            socket.on("secureConnect", () => {
                sslHandshake = performance.now();
            });
        });

        req.on("error", (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

function download(bytes) {
    const options = {
        hostname: "speed.cloudflare.com",
        path: `/__down?bytes=${bytes}`,
        method: "GET",
    };

    return request(options);
}

function upload(bytes) {
    const data = "0".repeat(bytes);
    const options = {
        hostname: "speed.cloudflare.com",
        path: "/__up",
        method: "POST",
        headers: {
            "Content-Length": Buffer.byteLength(data),
        },
    };

    return request(options, data);
}

function measureSpeed(bytes, duration) {
    return (bytes * 8) / (duration / 1000) / 1e6;
}

async function measureLatency() {
    const measurements = [];

    for (let i = 0; i < 20; i += 1) {
        await download(1000).then(
            (response) => {
                // TTFB - Server processing time
                measurements.push(response[4] - response[0] - response[6]);
            },
            (error) => {
                console.log(`Error: ${error}`);
            },
        );
    }

    return [Math.min(...measurements), Math.max(...measurements), average(measurements), median(measurements), jitter(measurements)];
}

async function measureDownload(bytes, iterations) {
    const measurements = [];

    for (let i = 0; i < iterations; i += 1) {
        await download(bytes).then(
            (response) => {
                const transferTime = response[5] - response[4];
                measurements.push(measureSpeed(bytes, transferTime));
            },
            (error) => {
                console.log(`Error: ${error}`);
            },
        );
    }

    return measurements;
}

async function measureUpload(bytes, iterations) {
    const measurements = [];

    for (let i = 0; i < iterations; i += 1) {
        await upload(bytes).then(
            (response) => {
                const transferTime = response[6];
                measurements.push(measureSpeed(bytes, transferTime));
            },
            (error) => {
                console.log(`Error: ${error}`);
            },
        );
    }

    return measurements;
}

module.exports = async function speedTest() {
    let result = {};
    try {
        result["ping"] = Math.round((await measureLatency())[3]);

        const testDown1 = await measureDownload(101000, 10);
        const testDown2 = await measureDownload(25001000, 4);
        const testDown3 = await measureDownload(100001000, 1);
        result["download"] = quartile([...testDown1, ...testDown2, ...testDown3], 0.9).toFixed(2);

        const testUp1 = await measureUpload(11000, 10);
        const testUp2 = await measureUpload(101000, 10);
        const testUp3 = await measureUpload(1001000, 8);
        result["upload"] = quartile([...testUp1, ...testUp2, ...testUp3], 0.9).toFixed(2);
    } catch (error) {
        console.error("Error while using cloudflare speedtest");
        result = {error: error.message};
    }

    return result;
}