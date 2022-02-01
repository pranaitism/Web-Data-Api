$(document).ready(function() {
    $("#countries").change(function() {

        $("#cities").load($(this).val() + "-cities.html")
    });
    $("#cities").change(function() {
        let city = "";
        city = $(this).val();
        // please change apiURl to yours
        let apiUrl = 'https:\/\/api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=8f49f4bca36ea86629e90e9084acfa02';
        $.ajax({
            url: apiUrl,
            type: "GET",
            dataType: "json",
            success: function(response) {
                let city_name = response.name;
                let date = response.dt;
                let convertedDate = convertDate(date);
                //uncomment function console.log(convertedDate); to check if date converted correctly
                //console.log(convertedDate);
                let icon = '<img id="icon" src="http://openweathermap.org/img/wn/' + response.weather[0].icon +
                    '@2x.png" alt="weatherIcon"/>';
                let weather_description = response.weather[0].description;
                let celsius_data = response.main.temp;
                //uncomment below to check if temperature warning displayed
                //celsius_data = 36;
                let meter_per_second = response.wind.speed;
                // calls function windSpeedMph and converts meters per second to miles per hour
                let wind_mph = windSpeedMph(meter_per_second);
                // calls function windSpeedKph and converts miles per hour to kilometers per hour
                let wind_kph = windSpeedKph(wind_mph);
                //uncomment bellow to check if wind warning is displayed
                //wind_kph = 80.48;
                let wind_degree = response.wind.deg;
                let wind_direction_data = windDirection(wind_degree);
                //uncomment bellow if windDirection returns value
                //console.log (wind_direction_data);
                let table = $("" +
                    "<table>" +
                    "<tr>" +
                    "<th>City Name</th>" +
                    "<th>Date</th>" +
                    "<th>Weather condition</th>" +
                    "<th>Weather Description</th>" +
                    "<th>Wind speed</th>" +
                    "<th>Wind degree and direction</th>" +
                    //extends cell by two columns
                    "<th colspan='2'>Temperature</th></tr>"
                );
                table.append(
                    "<tr class='table'>" +
                    "<td >" + city_name + "</td>" +
                    "<td>" + convertedDate + "</td>" +
                    "<td>" + icon + " </td>" +
                    "<td class='warning'><span>" + weather_description + "</span> </br>" +
                    "<span> " + tempWarning(celsius_data) + "</span> </br> " +
                    "<span>" + windWarning(wind_mph, wind_kph) + " </span>" +
                    "</td>" +
                    "<td>" + wind_mph.toFixed(0) + " Mph / " + wind_kph.toFixed(0) + " Kph </td>" +
                    "<td>" + wind_degree + " &deg " + wind_direction_data + " </td>" +
                    "<td>" + celsius_data.toFixed(0) + " &#8451 </td>" +
                    "</tr>"
                );
                // second AJAX call
                let imperial_apiUrl = 'https:\/\/api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&APPID=8f49f4bca36ea86629e90e9084acfa02';
                $.ajax({
                    url: imperial_apiUrl,
                    type: "GET",
                    dataType: "json",
                    success: function(response) {
                        $(".table").append("<td class='fahrenheit'>" + response.main.temp.toFixed(0) + " &#8457</td>");
                    },
                    error: function(xhr, error) {
                        $("#info").append(error.toUpperCase() + ". HTTP status: " + xhr.status);
                    }
                });
                $("#cityinfo").html("");
                $("#cityinfo").append(table);
                if ($("#cities").attr("hidden")) {
                    $("#cities").show();
                }
            },
            error: function(xhr, error) {
                $("#info").append(error.toUpperCase() + ". HTTP status: " + xhr.status);
            }
        });
    });
});

//https://www.surfertoday.com/windsurfing/how-to-read-wind-direction
//https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words

function windDirection(num) {
    let val = Math.floor((num / 45) + 0.5);
    let arr = ["NORTHERLY", "NORTH EASTERLY", "EASTERLY", "SOUTH EASTERLY", "SOUTHERLY", "SOUTH WESTERLY", "WESTERLY", "NORTH WESTERLY"];
    return arr[(val % 8)]
}

//https://stackoverflow.com/questions/14786736/convert-unix-timestamp-in-jquery
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
//Function converts unix timestamp to date format dd/mm/yyyy.
function convertDate(unix_date) {
    let ms = new Date(unix_date * 1000);
    let day = (ms.getDate() < 10 ? '0' : '') + ms.getDate();
    let month = (ms.getMonth() < 9 ? '0' : '') + (ms.getMonth() + 1);
    let year = ms.getFullYear();
    return day + '/' + month + '/' + year;
}

function windSpeedMph(ms) {
    return ms * 2.2369;
}

function windSpeedKph(mph) {
    // Multiply mph * 1.609 to get kph and store in variable
    return mph * 1.609;
}

function tempWarning(temp_data) {
    return ((temp_data > 35) || (temp_data < -5) ? 'High temperature: Severe weather warning' : '');
}

function windWarning(wind_mph, wind_kph) {
    return ((wind_mph > 50) || (wind_kph > 80.47) ? "Strong wind: Severe weather warning" : "");
}