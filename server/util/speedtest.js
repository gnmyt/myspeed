const {spawn} = require('child_process');

module.exports = async (mode, serverId) => {
    const binaryPath = mode === "ookla" ? './bin/speedtest' + (process.platform === "win32" ? ".exe" : "")
        : './bin/librespeed-cli' + (process.platform === "win32" ? ".exe" : "");

    const startTime = new Date().getTime();
    let args;

    if (mode === "ookla") {
        args = ['--accept-license', '--accept-gdpr', '--format=json'];
        if (serverId) args.push(`--server-id=${serverId}`);
    } else {
        args = ['--json', '--duration=5'];
        if (serverId) args.push(`--server=${serverId}`);
    }

    let result = {};

    const testProcess = spawn(binaryPath, args, {windowsHide: true});

    testProcess.stderr.on('data', (buffer) => {
        result.error = buffer.toString();
        if (buffer.toString().includes("Too many requests")) {
            result.error = "Too many requests. Please try again later";
        }
    });

    testProcess.stdout.on('data', (buffer) => {
        const line = buffer.toString().replace("\n", "");
        if (!(line.startsWith("{") || line.startsWith("["))) return;

        let data = {};
        try {
            data = JSON.parse(line);
            if (line.startsWith("[")) data = data[0];
        } catch (e) {
            data.error = e.message;
        }

        if (data.error) result.error = data.error;

        if ((mode === "ookla" && data.type === "result") || mode === "libre") result = data;
    });

    await new Promise((resolve, reject) => {
        testProcess.on('error', e => reject({message: e}));
        testProcess.on('exit', resolve);
    });

    if (result.error) throw new Error(result.error);
    return {...result, elapsed: new Date().getTime() - startTime};
}