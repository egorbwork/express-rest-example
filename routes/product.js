let authorization = require('./common').authorization;
let ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
    app.get('/products', [authorization, (req, res) => {
        db.collection('products').find().toArray(
            (err, items) => {
                if (err) {
                    res.status(500).json({code: 'db.error', 'error': 'An error has occurred'});
                } else {
                    res.status(200).json({items, total: items.length});
                }
            }
        );
    }]);
    app.get('/products/:id', [authorization, (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('products').findOne(
            details,
            (err, item) => {
                if (err) {
                    res.json(500, {code: 'db.error', 'error': 'An error has occurred'});
                } else {
                    res.json(200, item);
                }
            }
        );
    }]);
    app.post('/products', [authorization, (req, res) => {
        let product = req.body;
        if (!isValidProduct(product)) {
            return res.json(400, {code: 'validation.error', 'error': 'Invalid input!'})
        }
        db.collection('products').insertOne(product, (err, result) => {
            if (err) {
                res.json(500, {code: 'db.error', 'error': 'An error has occurred'});
            } else {
                res.json(200, result.ops[0]);
            }
        });
    }]);
    app.delete('/products/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('products').deleteOne(details, (err, item) => {
            if (err) {
                res.json(500, {code: 'db.error', 'error': 'An error has occurred'});
            } else {
                res.json(200, {message: 'product with id: ' + id + ' deleted!'});
            }
        });
    });
    app.put ('/products/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        let product = req.body;
        if (!isValidProduct(product)) {
            return res.json(400, {code: 'validation.error', 'error': 'Invalid input!'})
        }
        delete product._id;
        db.collection('products').updateOne(details, product, (err, result) => {
            if (err) {
                res.json(500, {code: 'db.error', 'error': 'An error has occurred'});
            } else {
                product._id = id;
                res.json(200, product);
            }
        });
    });
    app.patch ('/products/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        let data = req.body;
        delete data._id;
        db.collection('products').findOne(
            details,
            (err, item) => {
                if (err) {
                    res.json(500, {code: 'db.error', 'error': 'An error has occurred'});
                } else {
                    for (let field of Object.getOwnPropertyNames(data)) {
                        item[field] = data[field];
                    }
                    if (!isValidProduct(item)) {
                        return res.json(400, {code: 'validation.error', 'error': 'Invalid input!'})
                    }
                    db.collection('products').updateOne(details, item, (err, result) => {
                        if (err) {
                            res.json(500, {code: 'db.error', 'error': 'An error has occurred'});
                        } else {
                            res.json(200, item);
                        }
                    });
                }
            }
        );
    });
};

let isValidProduct = function (product) {
    if (!product.name || typeof product.name !== 'string' || product.name.length < 3) {
        return false;
    }
    if (!product.price || !Number.isFinite(product.price) || product.price <= 0) {
        return false;
    }
    if (!product.description || typeof product.description !== 'string' || product.description.length < 0) {
        return false;
    }
    return true;
};
