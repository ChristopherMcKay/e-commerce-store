const Cart = require('../models/Cart');

module.exports = {

    addCartItem: function(req) {
        return new Promise((resolve, reject) => {

            Cart.findOne({ owner: req.user._id })
                .then( cart => {

                    cart.total = (cart.total + Number(req.body.quantity));
                    cart.items.push({
                        item:     req.body.product_id,
                        quantity: parseInt(req.body.quantity),
                        price:    parseFloat(req.body.priceValue)})  
                    
                    cart.save();

                    resolve(cart)
                })
                .catch( error => {
                    reject(error);
                })
        })
    },

    showCart: function(req, res, next) {
        Cart.findOne({ owner: req.user._id })
            .populate('items.item')
            .exec(function( error, foundCart) {
                if (error) {
                    let errors = {};
                    errors.message = error;
                    errors.status = 400;
                    res.status(errors.status).json(errors)
                }
                else {
                    res.render('./cart/cart', {foundCart: foundCart, message: req.flash('remove')})
                }
            })
    },

    removeProduct: function(req, res, next) {



        Cart.findOne({ owner: req.user._id })
            .then( (foundCart) => {
                let totalMinus = foundCart.items[0].quantity;
                console.log(totalMinus);
                foundCart.items.pull(String(req.body.item));


                foundCart.total = (foundCart.total - totalMinus);

                foundCart.save()
                        .then( cart => {
                            req.flash('remove', 'Succesfully removed')
                            res.redirect('/api/cart')
                        }) 
                        .catch( (error) => {
                            let errors = {};
                            errors.message = error;
                            errors.status = 400;
                            res.status(errors.status).json(errors);
                        });

                
            })
            .catch( (error) => {
                let errors = {};
                errors.message = error;
                errors.status = 400;
                res.status(errors.status).json(errors);
            });

    }
}