let Product = require('../../models/Product');

module.exports = {

    getAllProducts: (req, res, next) => {
        var perPage = 9
        var page = req.params.page || 1

        Product
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Product.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('index-pagination', {
                    products: products,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
        // return new Promise ( (resolve, reject) => {
        //     Product.find({})
        //             .then ( products => {
        //                 resolve(products);
        //             })
        //             .catch( error => {
        //                 let errors = {};

        //                 errors.message = error;
        //                 errors.status = 500;
        //                 reject(errors);
        //             })
        // })
    },

    getProductInfo: (req, res, next) => {
        let productID = Object.keys(req.query)[0]

        Product.findById({ _id: productID })
                .then( product => {
                    res.render('product/product-page', { product: product });
                })

    },

    searchProductByInput: params => {
        return new Promise ((resolve, reject) => {
            Product.search({
                query_string: {
                    query: params
                }
            }, function (err, results) {
                if (err) {
                    let errors = {};
                    errors.status = 500;
                    errors.message = error;
                    
                    reject(errors)
                }
                else {
                    let roughData = results.hits.hits.map(function(hit) {
                        return hit;
                    });
                    
                    let data = [];

                    for (let i = 0; i < roughData.length; i++) {
                        data.push(roughData[i]._source)
                    }

                    for (let i = 0; i < data.length; i++) {
                        data[i]._id = roughData[i]._id
                    }

                    resolve(data);
                }
            });
        });
    },

    getProductsByCategory: (req, res, next) => {
        // let categoryID = Object.keys(req.query)[0]
        let categoryID = req.params.id;

        Product.find({ category: categoryID })
                .then( products => {
                    res.render('index', { products: products });
                })
    },

    instantSearch: (req, res) => {

        Product.search({
            query_string: {
                query: req.body.search_term
            }
        }, function(error, products) {
            if (error) {
                let errors = {};
                errors.status = 500;
                errors.message = error;
                res.status(errors.status).json(errors);
            }
            else {
                res.json(products);
            }
        }
        )
    }

}