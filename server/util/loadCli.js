const libreProvider = require('./providers/loadLibre');
const ooklaProvider = require('./providers/loadOokla');

module.exports.load = async () => {
    await libreProvider.load();
    await ooklaProvider.load();
}