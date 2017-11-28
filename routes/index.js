const productRoutes = require('./product');

module.exports = function(app, db) {
    productRoutes(app, db);
};
