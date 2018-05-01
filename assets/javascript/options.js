console.log("linked");

//creating an on click for submitTwo to record what's been input


$("#submit").on("click", function(event) {

  console.log("clicked");
  event.preventDefault();

  //need to set up a function that updates the zip code input from the options page

  var zipCode = $(".zipcode")
    .val()
    .trim();
  console.log(zipCode);

  //I think I need a moment.js function to get the date to appear YYYY-MM-DD
  var date = $(".date")
    .val()
    .trim();
  console.log(date);

  var queryURL =
    "http://data.tmsapi.com/v1.1/movies/showings?startDate=" +
    date +
    "&zip=" +
    zipCode +
    "&radius=10&api_key=cv2kmy58qkdgyhekzsnz7quz";

  $.ajax({
    url: queryURL,
    method: "GET"

  }).then(function (response) {
    movieChallenger();

    function movieChallenger() {

      //creating a random integer to pull random movie titles.
      var rT = Math.floor(Math.random() * response.length);
      //console.log(rT);
      //console.log(response[rT]);

      var randomTitle = response[rT].title;
      console.log("Your Movie Title is: " + randomTitle);

      //creating a random integer to pull random showtimes of the selected random movie
      var rS = Math.floor(Math.random() * response[rT].showtimes);

      var randomShowtimesArray = response[rT].showtimes;
      //console.log(randomShowtimesArray);

      //Showtime array includes the theatres.  We have to run a random number to get theatre selection.
      var rTheat = Math.floor(Math.random() * randomShowtimesArray.length);
      //console.log(randomShowtimes[rTheat]);

      var randomTheatreArray = randomShowtimesArray[rTheat];
      console.log("Playing at this date and time: " + randomTheatreArray.dateTime);
      console.log("Playing at this theatre: " + randomTheatreArray.theatre.name);
    };
  });
});



// Example queryURL for Gracenote API

//with the zipCode variable info get the movie theater information from the GraceNote API

//use a math.random to draw from the results to spit out a movie and movie theater selection.

//4-30-2018 -Need to create a function to pull a random movie and then a random theater and showtime for that movie