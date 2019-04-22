function categoryValidation(req, res, next) {

    req.checkBody('name', 'Category is required').notEmpty();

    var errorValidate  = req.validationErrors();

    if (errorValidate) {
        req.flash('errors', 'Category cannot be empty')
        res.status(302).redirect('./add-category');
    }
    else{
        next();
    }

}

module.exports = categoryValidation;