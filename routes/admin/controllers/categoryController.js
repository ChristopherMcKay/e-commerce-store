const Category = require('../../models/Category');
const Product = require('../../models/Product');

var faker = require('faker');


module.exports = {

    addCategory: function (params) {

        return new Promise((resolve, reject) => {

            Category.findOne({name: params.name})
                .then( category => {

                    if (category) {
                        let errors = {};
                        errors.message = 'Category already exists';
                        errors.status = 400;
                        reject(errors);
                    } else {

                        let newCategory = new Category();
   
                        newCategory.name = params.name;

                        newCategory
                            .save()
                            .then( category => resolve(category))
                            .catch(err => reject(err));

                    }

                })
                .catch(error => {
                    let errors = {};
                    errors.message = error;
                    errors.status = 400;
                    reject(errors);
                })


        })


    },

    getAllCategory: (req, res, next) => {
        Category.find({})
                .then( categories => {
                    res.render('category/create-fake-product', {
                        categories: categories,
                        success: req.flash('success')
                    })
                })
                .catch( error => {
                    let errors = {};
                    errors. status = 500;
                    error.message = error;

                    res.status(errors.status).json(errors);
                })
    },

    createFakeData:  (req, res, next) => {

        let catID = Object.keys(req.query)[0]


        for (let i = 0; i < 20; i++) {

            let newProduct = new Product();

            newProduct.category = catID;

            newProduct.name = faker.commerce.productName();

            newProduct.price = faker.commerce.price()


            newProduct.image = faker.image.image();

            newProduct.save()

        };
        
        Product.find({ category: Object.keys(req.query) })
                .then( products => {
                    res.render('product/create-fake-product', { products: products });
                })
                // .catch( error => {
                //     let errors = {}
                //     errors.message = error;
                //     req.flash('errors', errors.message);
                // })

    }


}