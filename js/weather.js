$(function() {
    var timeout = 0;
    /*
    This function selects an icon for a given weather text.

    Code source: https://developer.yahoo.com/weather/documentation.html#codes
    */
    function get_weather_icon(text) {

        text = text.toLowerCase();

        // This would usually be a more exaustive list, but this is just for showing
        if (text.includes('cloudy')) {
            return 'wi-cloudy';
        }

        if (text.includes('showers') || text.includes('rain')) {
            return 'wi-rain';
        }

        if (text.includes('sunny')) {
            return 'wi-day-sunny';
        }

        if (text.includes('snow')) {
            return 'wi-snow';
        }

        return 'wi-tsunami';
    }

    function handle_error() {

        $('#location-id').addClass('is-invalid');
        $('#location-form .feedback').text('Could not fetch the data');
    }

    function handle_success(data) {

        var location = data.query.results.channel.location;

        // Only the forecast is interesting to us
        data = data.query.results.channel.item.forecast;

        // Outputing only 5 elements as requested
        var count = 5;

        // Clear everything for new insertion
        $('#location-body').html('');

        // Set the new location
        $('#location-header h2').text(location.city + ', ' + location.country);

        for (var i = 0 ; i < count ; i++) {

            var content = $(
                '<div class="col location-body-item">' +
                '<div class="day"></div>' +
                '<div class="icon"><i class="wi"></i></div>' +
                '<div class="temp">' +
                '<span class="low"></span><span class="high"></span>' +
                '</div>' +
                '</div>'
            );

            var icon_class = get_weather_icon(data[i].text);

            $('.day', content).text(data[i].day);
            $('.icon i', content).addClass(icon_class);
            $('.temp .low', content).text(data[i].low);
            $('.temp .high', content).text(data[i].high);
        
            $('#location-body').append(content);
        }

        $('#form-section').hide();
        $('#render-section').show();
    }

    function get_weather() {
        
        var query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"%s\")";
        var url = "https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=";
       
        function buildRequest(text) {
            return url + query.replace("%s", text);
        }

        var location = $('#location-id').val();
            
        $.get(buildRequest(location), function(data) {

            if (data.query.count == 0) {
                handle_error();
            }

            else {
                handle_success(data);
                timeout = setTimeout(get_weather, 10000);
            }
        })
        .fail(handle_error);
    }

    $('#location-footer button').on('click', function(e) {
        //stop refresh weather
        clearTimeout(timeout);

        // Clear errors
        $('#location-id').removeClass('is-invalid');

        // Clear text input
        $('#location-form .feedback').text(null);
        $('#location-id').val(null);

        // Toggle views
        $('#form-section').show();
        $('#render-section').hide();
    });

    $('#location-form').on('submit', function(e) {
        e.preventDefault();
        get_weather(e);
    });

    // Initially hide the render section
    $('#render-section').hide();
});



