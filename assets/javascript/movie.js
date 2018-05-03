console.log("linked");

//creating an on click for submitTwo to record what's been input
var rootRef = database.ref();

$("#searchSubmit").on("click", function(event) {
  event.preventDefault();

  //need to set up a function that updates the zip code input from the options page

  var zipCode = $(".zipcode")
    .val()
    .trim();
  // console.log(zipCode);

  //I think I need a moment.js function to get the date to appear YYYY-MM-DD
  var date = $(".date")
    .val()
    .trim();
  // console.log(date);

  var queryURL =
    "https://data.tmsapi.com/v1.1/movies/showings?startDate=" +
    date +
    "&zip=" +
    zipCode +
    "&radius=10&api_key=cv2kmy58qkdgyhekzsnz7quz";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // declare an empty array to hold the result
    let movieResults = [];
    // search results until you find one at least 1 hour in the future
    do {
      movieResults = movieChallenger();

      var time = moment(movieResults[1], "YYYY-MM-DDThh:mm");

    } while (!movieResults[0] || time.diff(moment(), "minutes") < 0);

    // set results variables
    var title = movieResults[0];
    var showTime = moment(movieResults[1], "YYYY-MM-DDThh:mm").format(
      "dddd MM/DD/YY hh:mm A"
    );
    var theatre = movieResults[2];

    // log movieResults
    console.log("Your Movie Title is: " + title);
    console.log("Playing at this date and time: " + showTime);
    console.log("Playing at this theatre: " + theatre);

    // addResultToDB(userEmail, title, showTime, theatre);

    function movieChallenger() {

      //creating a random integer to pull random movie titles.
      var rT = Math.floor(Math.random() * response.length);

      // isolate the selected movie
      var selected = response[rT];

      // remove the movie from the array in case we have to look again
      response.splice(rT, 1);

      // store the title of the film
      var randomTitle = selected.title;

      // store the showtimes array for the movie
      var randomShowtimesArray = selected.showtimes;

      //Showtime array includes the theatres.  We have to run a random number to get theatre selection.
      var selectedShowDateTime = "";
      var selectedTheatre ="";
      do {

        var rTheat = Math.floor(Math.random() * randomShowtimesArray.length);

        var randomShowtime = randomShowtimesArray[rTheat];

        randomShowtimesArray.splice(rTheat, 1);

         selectedShowDateTime = randomShowtime.dateTime;

         selectedTheatre = randomShowtime.theatre.name;

        var time = moment(selectedShowDateTime, "YYYY-MM-DDThh:mm");

      } while (randomShowtimesArray.length > 1 && time.diff(moment(), "mins") < 0);

      return [randomTitle, selectedShowDateTime, selectedTheatre];
    }
  });
});

// Example queryURL for Gracenote API

//with the zipCode variable info get the movie theater information from the GraceNote API

//use a math.random to draw from the results to spit out a movie and movie theater selection.

//4-30-2018 -Need to create a function to pull a random movie and then a random theater and showtime for that movie

function addResultToDB(userEmail, title, showTime, theatre) {
  var userIdRef = rootRef
    .child("users")
    .orderByChild("userId")
    .equalTo(userEmail);

  userIdRef.on("child_added", function(snap) {
    console.log(
      snap.ref.update({
        title: title,
        showTime: showTime,
        theatre: theatre
      })
    );
  });
}
