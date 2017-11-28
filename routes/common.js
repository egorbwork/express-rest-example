module.exports.authorization = function (req, res, next) {
    let authorization = req.header('authorization');
    if (!authorization || authorization !== 'It\'s me, Mario') {
        res.send(401, {code: 'invalid.header', error: 'Unauthorized user!'});
        return;
    }
    next();
};
