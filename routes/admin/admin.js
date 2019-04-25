var express = require('express');
var router = express.Router();
var categoryController = require('./controllers/categoryController');
var createProductController = require('./controllers/createProductController');

var faker = require('faker');

var categoryValidation = require('./utils/categoryValidation');

// var fakeCategories = [];

// for (let i = 0; i < 29; i++) {
//     fakeCategories.push(faker.commerce.department());
// }



router.get('/', function(req, res, next) {
    res.send('HEHE')
    res.render('index');
});

router.get('/add-category', function(req, res) {
    res.render('admin/add-category', {
        message: req.flash('success'),
        errors: req.flash('errors')
    });
});

router.post('/add-category', categoryValidation, function(req, res) {


    // res.send(req.body.name);

    categoryController.addCategory(req.body)
                .then( category => {

                  req.flash('success', 'Successfully added your category');
                  return res.redirect('/api/admin/add-category')

                  })
                .catch( error => {
                  req.flash('errors', error.message);
                  return res.redirect('/api/admin/add-category');
                })

  }
);

router.get('/show-all-category', categoryController.getAllCategory);

router.get('/create-fake-product', createProductController.createProductByCategoryID)


module.exports = router;