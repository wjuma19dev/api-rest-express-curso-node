const logger = function (req, res, next) {
    console.log('Loading');
    next();
}

module.exports = logger;


