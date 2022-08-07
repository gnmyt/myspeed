const recommendations = require('../models/Recommendations');

// Gets the current recommendations
module.exports.get = async () => {
    return await recommendations.findOne();
}

// Sets new recommendations
module.exports.set = async (ping, download, upload) => {
    await recommendations.destroy({truncate: true});
    return await recommendations.create({ping: Math.round(ping), download: download.toFixed(2), upload: upload.toFixed(2)});
}