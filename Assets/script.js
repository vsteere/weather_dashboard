//jQuery code to make it run only after everything loads

$(document).ready(function () {
    //this hides the divs for the 5 day forecast
    $(".weatherbox").hide();

    //these are the two divs where the weather data will be appended to
    var currentWeather = $("#currentWeather");
    var multidayWeather = $("#multiDayweather");
    var day1 =$("#day1");
    var day2 =$("#day2");
    var day3 =$("#day3");
    var day4 =$("#day4");
    var day5 =$("#day5");

    //array of initial cities that will be pulled into buttons when the page first loads
    var initialCities = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Atlanta"];


    //initial run of the function upon page load to show the cities in the initial array
    addThebutton();



    //Event handler that will take the data from the text box and add it to the array
    $("#searchNow").on("click", function (event) {
        event.preventDefault();
        var newCity = $("#enterCity").val().trim();
        

        //add the new city to the existing array
        initialCities.push(newCity);

        //this is the function that will run the logic through the array to actually add the button
        addThebutton();
    }
    );

    //function that will take the ciies from the array and make them all into buttons
    function addThebutton() {
        //this will keep the items in the array from showing up twice
        $("#prevSearches").empty();
        

        for (var i = 0; i < initialCities.length; i++) {

            //jQuery code to create the button
            var cityButton = $("<button>");

            //adding a class to all of the buttons
            cityButton.addClass("city-btn");
            //adding an attribute corresponding to the items in the array; this will help run the AJAX query later
            cityButton.attr("data-city", initialCities[i]);
            //this is the text for the initial buttons
            cityButton.text(initialCities[i]);
            //this adds the button the div
            $("#prevSearches").prepend(cityButton);

            //checking contents of array after a new city was added
            console.log(initialCities);
        }

    }

    function getWeather() {
        //adds a border to the current weather div
        $(currentWeather).css("border", "1px solid black");
        //clears the 5 day forecast boxes to only show the latest result
        $(day1).empty();
        $(day2).empty();
        $(day3).empty();
        $(day4).empty();
        $(day5).empty();

        //this pulls the city name of whatever button we click on
        var thisCity = $(this).attr("data-city");
        //data pull via api
        var weatherPull = "http://api.openweathermap.org/data/2.5/weather?q=" + thisCity + "&appid=5290a147bd4c081007c34f429776aca3";

        $.ajax({
            url: weatherPull,
            method: "GET"
        }).then(function (response) {

            //checking if the data pulls. This works
            console.log(response);

            //pull the specific object from the data to the dashboard
            console.log(response.weather[0].icon)
            var cityName = response.name;
            var cityNamedisp = $("<h2>");
            //Pulling image from data to the page
            var currentImage = response.weather[0].icon;
            var currentImagedisp = "http://openweathermap.org/img/wn/" + currentImage + ".png";
            var currentImagedispaddy = $("<img>").attr("src", currentImagedisp);
            //this will keep only one city's data in the box
            currentWeather.empty();
            //learned from a tutor the syntax for the below; city name and current date
            cityNamedisp.text(`${cityName}  ${moment().format("ll")}  `);

            currentWeather.append(cityNamedisp);
            currentWeather.append(currentImagedispaddy);

            //pulling the data for temp, converting it from Kelvin Fahrenheit, and rounding to 2 decimal points
            var currTemp = response.main.temp;
            var currTempfarh = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var tempP = $("<p>");
            tempP.text(`Temperature:  ${currTempfarh} degrees Fahrenheit`)
            currentWeather.append(tempP);

            //pulling the data for humidity and appending it to current weather block
            var currHumid = response.main.humidity;
            var humidP = $("<p>");
            humidP.text(`Humidity:  ${currHumid}%`)
            currentWeather.append(humidP);


            //pulling the data for wind speed and pulling it for current weather block
            var currWind = response.wind.speed
            var windP = $("<p>");
            windP.text(`Wind Speed ${currWind} MPH`);
            currentWeather.append(windP);




        });
        $.ajax({
            url: weatherPull,
            method: "GET"
        }).then(function (response) {

            //checking if the data pulls. This works
            console.log(response);

            //the longitude and latitude coordinates data for the UV index pull
            var currCitylat = response.coord.lat;
            var currCitylong = response.coord.lon;

            //defining the API URL for the UV index pull
            var uvPull = "http://api.openweathermap.org/data/2.5/uvi?appid=5290a147bd4c081007c34f429776aca3&lat=" + currCitylat + "&lon=" + currCitylong;


            //AJAX call for the UV index using the latitude and longitude from above
            $.ajax({
                url: uvPull,
                method: "GET"
            }).then(function (response) {

                var curUVindex = response.value;
                var curUVindexp = $("<p>");
                curUVindexp.text(`UV Index = ${curUVindex}`)
                //this checks if the API is pulling; this works
                console.log(curUVindex)
                currentWeather.append(curUVindexp);
            })


        })
        var multiDay = "http://api.openweathermap.org/data/2.5/forecast?q=" + thisCity + "&appid=5290a147bd4c081007c34f429776aca3";

        $.ajax({
            url: multiDay,
            method: "GET"
        }).then(function (response) {



            //checks the response of the multi day forecast API call. This works. 
            console.log(response)


            //pulling the data for the 5 days using the indexes corresponding to midnight of each day
            //day 1
            //shows the divs that were hidden upon load
            $(day1).show();
            var timeDate1 = response.list[0].dt_txt;
            //substring method pulling only the first 10 characters, which are the date
            var date1 = timeDate1.substring(0, 10);
            var header1 = $("<h5>");
            header1.text(date1);
            $(day1).append(header1);
            //pulling image associated with the day
            var multiImage = response.list[0].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $(day1).append(multiImageaddy);
            //pulls the temperature from the array, converts it to Fahrenheit and appends
            var day1Temp = ((response.list[0].main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var temp1P = $("<p>");
            temp1P.text(`Temperature:  ${day1Temp} degrees F`)
            day1.append(temp1P);
            //pulls humidity data from the array and appends it
            var day1Hum = response.list[0].main.humidity;
            var hum1P = $("<p>");
            hum1P.text(`Humidity:  ${day1Hum} %`)
            day1.append(hum1P);

            //day 2
            $(day2).show();
            var timeDate2 = response.list[7].dt_txt;
            var date2 = timeDate2.substring(0, 10);
            var header2 = $("<h5>");
            header2.text(date2);
            $(day2).append(header2);
            var multiImage = response.list[7].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $(day2).append(multiImageaddy);
            var day2Temp = ((response.list[7].main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var temp2P = $("<p>");
            temp2P.text(`Temperature:  ${day2Temp} degrees F`)
            day2.append(temp2P);
            var day2Hum = response.list[7].main.humidity;
            var hum2P = $("<p>");
            hum2P.text(`Humidity:  ${day2Hum} %`)
            day2.append(hum2P);


            //day 3
            $(day3).show();
            var timeDate3 = response.list[15].dt_txt;
            var date3 = timeDate3.substring(0, 10);
            var header3 = $("<h5>");
            header3.text(date3);
            $(day3).append(header3);
            var multiImage = response.list[15].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $(day3).append(multiImageaddy);
            var day3Temp = ((response.list[15].main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var temp3P = $("<p>");
            temp3P.text(`Temperature:  ${day3Temp} degrees F`)
            day3.append(temp3P);
            var day3Hum = response.list[15].main.humidity;
            var hum3P = $("<p>");
            hum3P.text(`Humidity:  ${day3Hum} %`)
            day3.append(hum3P);


            //day 4
            $(day4).show();
            var timeDate4 = response.list[23].dt_txt;
            var date4 = timeDate4.substring(0, 10);
            var header4 = $("<h5>");
            header4.text(date4);
            $(day4).append(header4);
            var multiImage = response.list[23].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $(day4).append(multiImageaddy);
            var day4Temp = ((response.list[23].main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var temp4P = $("<p>");
            temp4P.text(`Temperature:  ${day4Temp} degrees F`)
            day4.append(temp4P);
            var day4Hum = response.list[23].main.humidity;
            var hum4P = $("<p>");
            hum4P.text(`Humidity:  ${day4Hum} %`)
            day4.append(hum4P);

            //day 5
            $(day5).show();
            var timeDate5 = response.list[31].dt_txt;
            var date5 = timeDate5.substring(0, 10);
            var header5 = $("<h5>");
            header5.text(date5);
            $(day5).append(header5);
            var multiImage = response.list[31].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $(day5).append(multiImageaddy);
            $(day5).append(multiImageaddy);
            var day5Temp = ((response.list[31].main.temp - 273.15) * 1.80 + 32).toFixed(1);
            var temp5P = $("<p>");
            temp5P.text(`Temperature:  ${day5Temp} degrees F`)
            day5.append(temp5P);
            var day5Hum = response.list[31].main.humidity;
            var hum5P = $("<p>");
            hum5P.text(`Humidity:  ${day5Hum} %`)
            day5.append(hum5P);







        })

        //closing bracket for the function
    }





    //on click event handler when the city btn class button is clicked it runs the getWeather function for that city
    $(document).on("click", ".city-btn", getWeather);


    //these are the closing brackets for document.ready code up at the top
})
