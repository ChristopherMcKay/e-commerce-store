

$("#plus").click( function(e) {
    e.preventDefault()
    let total = $('#total').html();
    let price = parseFloat($('#priceValue').val());

    price += parseFloat($('#priceHidden').val());
    total++
    
    $('#total').html(total)
    $('#priceValue').val(price.toFixed(2));

})

$("#minus").click( function(e) {
    e.preventDefault()
    let total = $('#total').html();
    let price = parseFloat($('#priceValue').val());

    price -= parseFloat($('#priceHidden').val());
    total -= 1;

    if (total < 1) {
        return;
    }

    $('#total').html(total);
    $('#priceValue').val(price.toFixed(2));
})

