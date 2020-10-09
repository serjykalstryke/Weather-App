//GLOBAL VARIABLES//
var APIKey = "90d4018edda83b7466b5bc9d425686c1"
var cityList = JSON.parse(localStorage.getItem("cityList")) || [];
var cityJSON = localStorage.setItem('cityList',JSON.stringify(cityList))
var date = moment().format('dddd, MMMM Do');
//DATE FUNCTION//
$('#date').prepend(date)
//on start, execute this function//
$(document).ready(function () {
    loadCities();
    defaultSearch();
    renderButtons()
    //clicker function for search button//
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
    //clicker function for home button, calls default search function to show local weather//
    $('#home-btn').on('click', function (event) {
        defaultSearch()
    });
    //function for previous search history buttons//
    $('.searchHistory').on('click', '.historyBtn', function (event) {
        event.preventDefault();
        var cityBtn = $(this).text()
        console.log(cityBtn)
        weatherGenerator(cityBtn);
    });
    //stores searched cities//
    function storeCities() {
        localStorage.setItem('cityList', JSON.stringify(cityList));
    }

    function loadCities() {
        cityList = JSON.parse(localStorage.getItem("cityList") )
    }
    //generates buttons for previous searches//
    function renderButtons() {
        $('.searchHistory').html('');
        for (var i = 0; i < cityList.length; i++) {

            var cityName = cityList[i]
            var historyBtn = $(
                '<button type="button" class="btn btn-lg btn-block historyBtn text-white">'
            ).text(cityName);
            $('.searchHistory').append(historyBtn);
        }
    }
//weather generator function, calls openweather API to populate app//
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
                var fiveDayForcast = $('#5-day-row')
                fiveDayForcast.empty()
                for (var j = 0; j < 6; j++) {
                    var cardContainer = $('<div class="card-container">')
                    var card = $('<div class="card bg-secondary m">')
                    var cardHeader = $('<div class="card-header">')
                    var cardBody = $('<div class="card-body">')
                    var img = $(`<img id="${j}img">`)
                    var cardTextTemp = $('<p class="card-text">')
                    var cardTextHumid = $('<p class="card-text">')
                    card.addClass("mb-3 col-3")
                    card.attr("style", "max-width: 15rem")
                    cardTextTemp.attr("id", `${j}temp`)
                    cardTextHumid.attr("id", `${j}humid`)
                    cardHeader.attr("id", `${j}Date`)
                    var cardArray = [img, cardTextTemp, cardTextHumid]
                    cardBody.append(cardArray)
                    card.append([cardHeader, cardBody])
                    cardContainer.append(card)
                    fiveDayForcast.append(cardContainer)
                    var alteredArr = response.daily;
                    var timeStamp = alteredArr[j].dt;
                    var date = moment(timeStamp * 1000).format("dddd");
                    $(`#${j}img`).attr(
                        'src',
                        `http://openweathermap.org/img/wn/${response.daily[j].weather[0].icon}@2x.png`
                    );
                    $(`#${j}temp`).html(
                        `Temp: ${response.daily[j].temp.day} &#8457;`
                    );
                    $(`#${j}humid`).html(
                        `Humidity: ${response.daily[j].humidity}%`
                    );
                    $(`#${j}Date`).html(
                        date
                    )
                }
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
                UVEl.append("<span class='uv'>" + "UV Index: " + todayUV + "</span>")

                if (todayUV < 2) {
                    $('.uv').css("background", "green")
                } else if (todayUV >= 2 && todayUV < 6) {
                    $('.uv').css("background", "yellow")
                } else if (todayUV > 6) {
                    $('.uv').css("background", "red")
                }


            });
        });
    };

    //initial search function that populates app with local weather data//
    function defaultSearch() {
        navigator.geolocation.getCurrentPosition((position) => {
            var positionArray = [position.coords.latitude, position.coords.longitude];
            console.log(positionArray)
        $.ajax({
            url: "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + positionArray[0] + "&longitude=" + positionArray[1] + "&localityLanguage=en",
            method: "GET"
        }).then(function (response) {
            console.log(response)
            var city = response.city
            weatherGenerator(city)
            })
          });
        }

});