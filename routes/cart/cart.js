var express = require('express');
var router = express.Router();
var cartController = require('./controllers/cartController')

var stripe = require('stripe')('sk_test_33zL5oM7Q4TSbvquBg3SszAC00JIz6m3Rk');

var Cart = require('../cart/models/Cart');
var User = require('../users/models/User')

var async = require('async');

router.get('/', cartController.showCart);

router.post('/product/:id', function(req, res, next) {
    cartController.addCartItem(req)
                    .then( (cart) => {
                        return res.redirect('/api/cart');
                    })
                    .catch( (err) => {
                        res.json({
                            confirmation: 'Failure',
                            Error: err
                        })
                    })
})

router.delete('/remove', cartController.removeProduct)

router.post('/payment', function(req, res, next) {

    let stripeToken = req.body.stripeToken;

    let currentCharges = (req.body.stripeMoney * 100);

    stripe.customers.create({
        source: stripeToken
    })
    .then( customer => {
        let results = stripe.charges.create({
            amount: currentCharges,
            currency: 'usd',
            customer: customer.id
        })

        return results;
    })
    .then( results => {

        async.waterfall([
            function(callback) {
                Cart.findOne({ owner: req.user._id }, function(err, cart) {
                    callback(err, cart);
                });
            },
            function(cart, callback) {
                User.findOne({ _id: req.user._id}, function(err, user) {
                    if (user) {
                        for (let i = 0; i < cart.items.length; i++) {
                            user.history.push({
                                item: cart.items[i].item,
                                paid: cart.items[i].price,
                            })
                        }
                    }

                    user.save(function(err, user) {
                        if (err) return next(err);
                        callback(err, user);
                    })
                })
            },
            function(user) {
                Cart.update({ owner: user._id}, {$set: { items: [], total: 0}}, function(err, updated) {
                    if (updated) {
                        res.redirect('/');
                    }
                })
            }
        ])

    })
    .catch( error => {
        let errors = {};
        errors.message = error;
        errors.status = 500;
        res.json(errors);
    })
});

router.get('/thank-you', function(req, res, next) {
    res.render('cart/thank-you');
})

module.exports = router;

