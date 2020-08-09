//jQuery code to make it run only after everything loads

$(document).ready(function () {

    var currentWeather = $("#currentWeather");

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




    }



    










    

    getWeather();
    //on click event handler when the city btn class button is clicked it runs the getWeather function for that city
    $(document).on("click", ".city-btn", getWeather);


    //these are the closing brackets for document.ready code up at the top
})
