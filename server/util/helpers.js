module.exports.replaceVariables = (message, variables) => {
    for (const variable in variables)
        message = message.replace(`%${variable}%`, variables[variable]);
    return message;
}

module.exports.mapFixed = (entries, type) => ({
    min: Math.min(...entries.map((entry) => entry[type])),
    max: Math.max(...entries.map((entry) => entry[type])),
    avg: parseFloat((entries.reduce((a, b) => a + b[type], 0) / entries.length).toFixed(2))
});

module.exports.mapRounded = (entries, type) => ({
    min: Math.min(...entries.map((entry) => entry[type])),
    max: Math.max(...entries.map((entry) => entry[type])),
    avg: Math.round(entries.reduce((a, b) => a + b[type], 0) / entries.length)
});

module.exports.calculateTestAverages = (tests) => {
    let avgNumbers = {ping: 0, down: 0, up: 0, time: 0};

    tests.forEach((current) => {
        avgNumbers.ping += current.ping;
        avgNumbers.down += current.download;
        avgNumbers.up += current.upload;
        avgNumbers.time += current.time;
    });

    Object.keys(avgNumbers).forEach((key) => {
        avgNumbers[key] = avgNumbers[key] / tests.length;
    });

    return avgNumbers;
}