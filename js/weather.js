$(function() {

    function handle_error() {

    }

    function handle_success(data) {

        console.log(data.query.results.channel.item.forecast);

        $('#form-section').hide();
        $('#render-section').show();
    }

    $('#location-form').on('submit', function(e) {
        e.preventDefault();

        var query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"%s\")";
        var url = "https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=";
       
        function buildRequest(text) {
            return url + query.replace("%s", text);
        }

        var location = $('#locationId').val();
            
        $.get(buildRequest(location), function(data) {

            if (data.count === 0) {
                handle_error();
            }

            else {
                handle_success(data);
            }
        })
        .fail(handle_error);
    });

    // Initially hide the render section
    $('#render-section').hide();
});



