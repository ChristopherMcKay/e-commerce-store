var express = require('express');
var router = express.Router();
var productController = require('./product/controllers/productController')

/* GET home page. */
router.get('/', productController.getAllProducts);

module.exports = router;
