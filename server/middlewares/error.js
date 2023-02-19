module.exports = (err, req, res, next) => {
    if (!(err instanceof SyntaxError)) return next();

    res.status(400).json({message: "You need to provide a valid JSON body"});
}