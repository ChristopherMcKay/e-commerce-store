var express = require('express');
var router = express.Router();
var productController = require('./controllers/productController');

var Product = require('../models/Product');

Product.createMapping( function(err, mapping) {
    if (err) {
        console.log('Error creating mapping');
        console.log(err);
    }
    else {
        console.log('Mapping created');
        console.log(mapping);
    }
});

var stream = Product.synchronize() 
var count = 0;

stream.on('data', function() {
    count++;
})

stream.on('close', function() {
    console.log(`Indexed ${count} documents`);
})

stream.on('error', function() {
    console.log(error);
})

router.get('/', function(req, res, next) {
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
});

router.get('/allproducts/:page', function(req, res, next) {
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
})

router.get('/product-page', productController.getProductInfo);

router.post('/getproductbyinput', function(req, res, next) {

    productController.searchProductByInput(req.body.name)
                    .then( results => {
                        res.render('index', {products: results})
                    })
                    .catch( error => {
                        res.status(error.status).json(error);
                    })
})

router.get('/products-by-category/:id', productController.getProductsByCategory)

router.post('/instant-search', productController.instantSearch)

 // productController.searchProductByInput(req.body.search_term)
    //                 .then( results => {
    //                     res.send(results)
    //                 })
    //                 .catch( error => {
    //                     res.send(error);
    //

module.exports = router;
