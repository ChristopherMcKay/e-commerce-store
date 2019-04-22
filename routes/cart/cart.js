var express = require('express');
var router = express.Router();
var cartController = require('./controllers/cartController')

router.get('/', function(req, res) {
    res.send('from cart');
});

router.post('/product/:id', function(req, res, next) {
    cartController.addCartItem(req)
                    .then( (cart) => {
                        req.flash('success', 'Item added to cart!');
                        return res.redirect('/');
                    })
                    .catch( (err) => {
                        res.json({
                            confirmation: 'Failure',
                            Error: err
                        })
                    })
})

module.exports = router;

