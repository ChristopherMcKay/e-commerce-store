$(function() {
    $('#search').keyup(function() {
        var search_term = $(this).val();

        $.ajax({
            method: 'POST',
            url: '/api/product/instant-search',
            data: {
                search_term: search_term
            },
            dataType: 'json',
            success: function(json) {
                let data = json.hits.hits.map(function(hit) {
                    return hit;
                });

                $('#productSearchResults').empty();


                if (data.length === 0) {
                    let message = '<h4>No search results were found</h4>';

                    $('#productSearchResults').append(message).addClass('d-flex justify-content alert alert-warning');

                }

                else {
                    for (let i = 0; i < data.length; i++) {
                
                        let html = "";
                        
                        html += '<div>'
                        html += '<div class="card" style="width: 18rem;">'
                        html += `<img class="card-img-top" src=${data[i]._source.image} alt="Card image cap" />`
                        html += '<div class="card-body">'
                        html += `<h5 class="card-title">${data[i]._source.name}</h5>`
                        html += `<a href="/api/product/${data[i]._id}" >`
                        html += '<button class="btn btn-primary">Shop Now</button>'
                        html += '</a>'
                        html += '</div>'
                        html += '</div>'
            
                    
                        
                        $('#productSearchResults').append(html).removeClass('d-flex justify-content alert alert-warning');
                }
        }
        },
            error: function(error) {
                console.log('error', error);
            }
        })
    })
})