const Cart = require('../models/Cart');

module.exports = {
    addCartItem: function(req) {
        return new Promise((resolve, reject) => {
            let newCart = new Cart();

            newCart.owner = req.user._id;
            newCart.total += req.body.quantity;
            newCart.items.item = req.body._id;
            newCart.items.quantity = req.body.quantity;
            newCart.items.price = req.body.priceValue;

            newCart.save()
                    .then( cart => resolve(cart))
                    .catch(err => reject(err));
        })
    }
}