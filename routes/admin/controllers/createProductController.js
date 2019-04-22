const Category = require('../../models/Category');
const Product = require('../../models/Product');

var faker = require('faker');

module.exports = {
    createProductByCategoryID:  (req, res, next) => {

        let catID = Object.keys(req.query)[0]


        for (let i = 0; i < 5; i++) {

            let newProduct = new Product();

            newProduct.category = catID;

            newProduct.name = faker.commerce.productName();
            newProduct.price = faker.commerce.price()
            newProduct.image = faker.image.image();

            newProduct.save()

        };
        
        Product.find({ category: Object.keys(req.query) })
                .then( products => {
                    console.log(products)
                    res.render('product/create-fake-product', { products: products });
                })
                // .catch( error => {
                //     let errors = {}
                //     errors.message = error;
                //     req.flash('errors', errors.message);
                // })

    }
}