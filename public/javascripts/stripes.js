$(function() {
    Stripe.setPublishableKey('pk_test_FdNmc9W4hinVHC7eIKhhqZHr00SeXi3Xbv');

    function stripeResponseHandler(status, response) {
        var $form = $('#payment-form');

        if (response.error) {
            $form.find('.payment-errors').text(response.error.message);
            $form.find('button').prop('disabled', true);
        }
        else {
            var token = response.id;
            $form.append($('<input type="hidden" name="stripeToken" />').val(token));
            $('#loading').append('Loading...');
            $form.get(0).submit();
        }
    }

    $('#payment-form').submit(function(event) {
        var $form = $(this);

        let cardNumber = $('#card-number').val();
        let cvcCode = $('#card-cvc').val();
        let expMonth = $('#card-expiry-month-year').val().slice(0, 2);
        let expYear = $('#card-expiry-month-year').val().slice(2, 4);

        let total = $('#total').val();
        
        $form.find('button').prop('disabled', true);

        Stripe.card.createToken({
            number: cardNumber,
            cvc: cvcCode,
            exp_month: expMonth,
            exp_year: expYear
        }, stripeResponseHandler);

        Stripe.source.create({
            type: 'bancontact',
            amount: total,
            currency: 'usd',
            owner: {
              name: 'Some dude',
            },
            redirect: {
              return_url: 'https://shop.example.com/crtA6B28E1',
            },
          }, stripeResponseHandler);

        return false;
    })
});