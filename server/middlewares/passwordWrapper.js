const passwordMiddleware = require('./password');

const passwordWrapper = (allowViewAccess, customResponseHandler) => async (req, res, next) => {
    // Intercept the response send method
    const originalSend = res.send.bind(res);

    res.send = function (body) {
        // Check if the status code is 401 and a custom response handler is provided
        if (res.statusCode === 401 && typeof customResponseHandler === 'function') {
            // The password middleware has returned a 401 status code, call the custom response handler
            return customResponseHandler(req, res);
        }
        // Call the original send method for other statuses
        return originalSend(body);
    };

    try {
        // Execute the original password middleware
        await passwordMiddleware(allowViewAccess)(req, res, next);
    } catch (err) {
        next(err);
    }
};

module.exports = passwordWrapper;
