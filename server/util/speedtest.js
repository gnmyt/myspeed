const {spawn} = require('child_process');

module.exports = async (serverId, binary_path = './bin/speedtest' + (process.platform === "win32" ? ".exe" : "")) => {
    const args = ['--accept-license', '--accept-gdpr', '--format=jsonl'];
    if (serverId) args.push(`--server-id=${serverId}`);

    let result = {};

    const process = spawn(binary_path, args, {windowsHide: true});

    process.stdout.on('data', (buffer) => {
        const line = buffer.toString().replace("\n", "");
        if (!line.startsWith("{")) return;

        let data = {};
        try {
            data = JSON.parse(line);
        } catch (e) {
            data.error = e.message;
        }

        if (data.error) result.error = data.error;

        if (data.type === "result") result = data;
    });

    await new Promise((resolve, reject) => {
        process.on('error', e => reject({message: e}));
        process.on('exit', resolve);
    });

    if (result.error) throw new Error(result.error);
    return result;
}