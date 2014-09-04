// Function to read query parameters
function getQueryParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// jQuery hack to highlight search terms
$(function() {
$.ui.autocomplete.prototype._renderItem = function( ul, item){
  var term = this.term.split(' ').join('|');
  var re = new RegExp("(" + term + ")", "gi") ;
  var t = item.label.replace(re,"<b>$1</b>");
  return $( "<li></li>" )
     .data( "item.autocomplete", item )
     .append( "<a>" + t + "</a>" )
     .appendTo( ul );
};

// Set up autocomplete callback
var cache = {};
var search_data_source = function(request, response) {
    var term = request.term;
    if (term in cache) {
        response(cache[term]);
        return;
    }
    $.getJSON( "../api/search/",
        request,
        function(data, status, xhr) {
            var reshaped_data = [];
            for (var i = 0; i < data[1].length; i++){
                reshaped_data.push({label: data[1][i], value: data[3][i]});
            }
            cache[term] = reshaped_data;
            response(reshaped_data);
    });
};

var search_select_function = function(event, ui){
    // Go to selected URL
    event.preventDefault();
    $(this).val(ui.item.label);
    
    window.location.href=ui.item.value+"?"+$.param(queryParameters);
};

var search_focus_function = function(event, ui){
    // Get rid of behavior where keyboard up down arrow replaces textbox with
    // url instead of search result.
    event.preventDefault();
};

autocomplete_settings = {
    minLength: 3,
    delay: 260,
    source: search_data_source,
    select: search_select_function,
    focus: search_focus_function,
}

$("#searchbar").autocomplete(autocomplete_settings);


querystring = getQueryParameterByName("term");
var bar = $("#searchbar");
bar.val(querystring);
bar.autocomplete("search", querystring);
bar.focus();

        });
