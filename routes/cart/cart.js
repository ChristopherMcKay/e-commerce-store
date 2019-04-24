var express = require('express');
var router = express.Router();
var cartController = require('./controllers/cartController')

router.get('/', cartController.showCart);

router.post('/product/:id', function(req, res, next) {
    cartController.addCartItem(req)
                    .then( (cart) => {
                        req.flash('success', 'Item added to cart!');
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


module.exports = router;

