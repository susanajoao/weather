$(function() {

    $('#location-form').on('submit', function(e) {
        e.preventDefault();

        var query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"%s\")";
        var url = "https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=";
       
        function buildRequest(text) {
            return url + query.replace("%s", text);
        }
            
        $.get(buildRequest('Lisbon'), function(data) {

            console.log(data);
        })
        .fail(function() {
            console.log('fail');
        });
    });
});



