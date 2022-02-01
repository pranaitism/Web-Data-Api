(function updateScore() {
    $.ajax({
        url: "weather.json",
        type: "GET",
        dataType: "json",
        success: function(response) {
            $("#weather_data").empty();
            let sTxt = "";
            sTxt += "<tr>" +
                "<th>City Id</th>" +
                "<th>City name</th>" +
                "<th>Weather description</th>" +
                "<th>Conditions</th>" +
                "<th>Temperature</th>" +
                "<th>Wind Speed</th>" +
                "<th>Wind Direction</th>" +
                "<th>Wind Chill Factor</th>" +
                "</tr>";
            $.each(response.weather, function(index) {
                let weather = response.weather[index].currentConditions.description;
                let weather_icon = '<img src="./weather_icons/' + weather + '.png" alt="weather_icon"/>';
                sTxt += "<tr><td>" + response.weather[index].cityId + "</td>" +
                    "<td>" + response.weather[index].cityName + "</td>" +
                    "<td>" + weather_icon + "</td>" +
                    "<td class='conditions'>" + response.weather[index].currentConditions.description + "</td>" +
                    "<td>" + response.weather[index].currentConditions.temperature + " &#8451</td>" +
                    "<td>" + response.weather[index].currentConditions.wind.windSpeed + " Mph</td>" +
                    "<td>" + response.weather[index].currentConditions.wind.windDirection + "</td>" +
                    "<td>" + response.weather[index].currentConditions.wind.windChillFactor + "</td></tr>";
            });
            $("#weather_data").append(sTxt);
            setTimeout(updateScore, 25000);
        },
        error: function() {
            $("#error_data").append(" <p>An error has occurred while retrieving the data</p>"); //display error if fail to retrieve data
        }
    });
})();