const recommendations = require('../models/Recommendations');
const {triggerEvent} = require("./integrations");

module.exports.getCurrent = async () => {
    return await recommendations.findOne();
}

module.exports.update = async (ping, download, upload) => {
    const configuration = {ping: Math.round(ping), download: parseFloat(download.toFixed(2)),
        upload: parseFloat(upload.toFixed(2))};
    
    await recommendations.destroy({truncate: true});

    triggerEvent("recommendationsUpdated", configuration).then(() => {});

    return recommendations.create(configuration);
}