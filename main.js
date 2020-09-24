//Global Variables//

var APIKey = "90d4018edda83b7466b5bc9d425686c1"


var cityList = []

var date = moment().format('dddd, MMMM h:mm');
$('#date').prepend(date)

$(document).ready(function () {

    $('#search-btn').on('click', function (event) {
        event.preventDefault();
        var city = $('#searchTerm').val();
        if (city === '') {
            return;
        }
        cityList.push(city)
        storeCities();
        renderButtons();
        weatherGenerator(city);
        console.log(cityList)
    });

    $('.searchHistory').on('click', '.historyBtn', function (event) {
        event.preventDefault();
        var cityBtn = $(this).text()
        console.log(cityBtn)
        weatherGenerator(cityBtn);
    });

    function storeCities() {
        localStorage.setItem('cityList', JSON.stringify(cityList));
    }

    function renderButtons() {
        $('.searchHistory').html('');
        for (var i = 0; i < cityList.length; i++) {
            var cityName = cityList[i];
            var historyBtn = $(
                '<button type="button" class="btn btn-primary btn-lg btn-block historyBtn">'
            ).text(cityName);
            $('.searchHistory').append(historyBtn);
        }
    }

    function weatherGenerator(cityBtn) {
        var cityName = cityBtn || $('#searchTerm').val();
        console.log(cityName);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            latitude = response.coord.lat;
            longitude = response.coord.lon
            console.log(response);
            console.log(queryURL);
            console.log(latitude, longitude)
            var cityList = $(cityList)
            var cities = response.name
            $("#city").empty()
            $("#city").append("City: " + cities)
            $('#currentImg').attr(
                'src',
                `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`)
            $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + "&appid=" + APIKey,
                    method: "GET"
                }).then(function (response) {

                    console.log(response)
                    var tempEl = $('#todaysTemp');
                    tempEl.empty();
                    var todayWeatherTemp = response.current.temp
                    tempEl.append("Temp: " + todayWeatherTemp.toFixed(2) + " F");
                    var humidityEl = $("#humidity")
                    humidityEl.empty();
                    var todayHumidity = response.current.humidity
                    humidityEl.append("Humidity: " + todayHumidity + "%");
                    var windEl = $('#windSpeed');
                    windEl.empty();
                    todayWind = response.current.wind_speed
                    windEl.append("Wind Speed: " + todayWind + "MPH");
                    var UVEl = $('#UVIndex')
                    UVEl.empty()
                    todayUV = response.current.uvi
                    UVEl.append("UV Index: " + todayUV)
                    UVEl.css("display", "block")

                    if (todayUV < 2) {
                        $(UVEl).css("color", "green")
                    } else if (todayUV >= 2 && todayUV < 6) {
                        $(UVEl).css("color", "yellow")
                    } else if (todayUV > 6) {
                        $(UVEl).css("color", "red")
                    }


                });
        });
    };
});