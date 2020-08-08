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
        // var weatherPull = "http://api.openweathermap.org/data/2.5/forecast?q=" + thisCity + "&appid=5290a147bd4c081007c34f429776aca3";
        var weatherPull = "http://api.openweathermap.org/data/2.5/weather?q=" + thisCity + "&appid=5290a147bd4c081007c34f429776aca3";

        $.ajax({
            url: weatherPull,
            method: "GET"
        }).then(function (response) {

                console.log("hi we are here");

                console.log(response.cod);
                //checking if the data pulls. This works
                console.log(response);

                //pull the specific object from the data to the dashboard


                    var cityName = response.name;
                    var cityNamedisp = $("<h2>");
                    var currentImage = $(`<img src="' +) 
                    console.log(moment().format("lll"));
                    currentWeather.empty();
                    cityNamedisp.text(`${cityName}  ${moment().format("ll")} `);
                    
                    currentWeather.append(cityNamedisp);

                    console.log(cityName);






            });

        
    }

    getWeather();
    //on click event handler when the city btn class button is clicked it runs the getWeather function for that city
    $(document).on("click", ".city-btn", getWeather);

})