//jQuery code to make it run only after everything loads

$(document).ready(function () {
    //this hides the divs for the 5 day forecast
    $(".card").hide();

    //these are the two divs where the weather data will be appended to
    var currentWeather = $("#currentWeather");
    var multidayWeather = $("#multiDayweather");

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
            $("#day1").show();
            var timeDate1 = response.list[0].dt_txt;
            //substring method pulling only the first 10 characters, which are the date
            var date1 = timeDate1.substring(0, 10);
            var header1 = $("<h5>");
            header1.text(date1);
            $("#day1").append(header1);
            //pulling image associated with the day
            var multiImage = response.list[0].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $("#day1").append(multiImageaddy);

            //day 2
            $("#day2").show();
            var timeDate2 = response.list[7].dt_txt;
            var date2 = timeDate2.substring(0, 10);
            var header2 = $("<h5>");
            header2.text(date2);
            $("#day2").append(header2);
            var multiImage = response.list[7].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $("#day2").append(multiImageaddy);

            //day 3
            $("#day3").show();
            var timeDate3 = response.list[15].dt_txt;
            var date3 = timeDate3.substring(0, 10);
            var header3 = $("<h5>");
            header3.text(date3);
            $("#day3").append(header3);
            var multiImage = response.list[15].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $("#day3").append(multiImageaddy);

            //day 4
            $("#day4").show();
            var timeDate4 = response.list[23].dt_txt;
            var date4 = timeDate3.substring(0, 10);
            var header4 = $("<h5>");
            header4.text(date4);
            $("#day4").append(header4);
            var multiImage = response.list[23].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $("#day4").append(multiImageaddy);

            //day 5
            $("#day5").show();
            var timeDate5 = response.list[31].dt_txt;
            var date5 = timeDate5.substring(0, 10);
            var header5 = $("<h5>");
            header5.text(date5);
            $("#day5").append(header5);
            var multiImage = response.list[31].weather[0].icon;
            var multiImagedisp = "http://openweathermap.org/img/wn/" + multiImage + ".png";
            var multiImageaddy = $("<img>").attr("src", multiImagedisp);
            $("#day5").append(multiImageaddy);







        })

        //closing bracket for the function
    }





    //on click event handler when the city btn class button is clicked it runs the getWeather function for that city
    $(document).on("click", ".city-btn", getWeather);


    //these are the closing brackets for document.ready code up at the top
})
