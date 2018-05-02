console.log("linked");

//creating an on click for submitTwo to record what's been input
var rootRef = database.ref();

$("#searchSubmit").on("click", function(event) {
  console.log("clicked");
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
    "http://data.tmsapi.com/v1.1/movies/showings?startDate=" +
    date +
    "&zip=" +
    zipCode +
    "&radius=10&api_key=cv2kmy58qkdgyhekzsnz7quz";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // declare an empty array to hold the result
    let results = [];
    // search results until you find one at least 1 hour in the future
    do {
      results = movieChallenger();

      var time = moment(results[1], "YYYY-MM-DDThh:mm");

      console.log(time.diff(moment(), "hours"));
    } while (time.diff(moment(), "hours") < 0);

    // set results variables
    var title = results[0];
    var showTime = moment(results[1], "YYYY-MM-DDThh:mm").format(
      "dddd MM/DD/YY hh:mm"
    );
    var theatre = results[2];

    // log results
    console.log("Your Movie Title is: " + title);
    console.log("Playing at this date and time: " + showTime);
    console.log("Playing at this theatre: " + theatre);
    console.log("zipCode " + zipCode);

    addResultToDB(userEmail, title, showTime, theatre, zipCode);

    function movieChallenger() {
      // console.log(response);

      //creating a random integer to pull random movie titles.
      var rT = Math.floor(Math.random() * response.length);
      //console.log(rT);
      // console.log(response[rT]);

      var randomTitle = response[rT].title;
      // console.log("Your Movie Title is: " + randomTitle);

      //creating a random integer to pull random showtimes of the selected random movie
      var rS = Math.floor(Math.random() * response[rT].showtimes.length);

      var randomShowtimesArray = response[rT].showtimes;
      //console.log(randomShowtimesArray);

      //Showtime array includes the theatres.  We have to run a random number to get theatre selection.
      var rTheat = Math.floor(Math.random() * randomShowtimesArray.length);
      //console.log(randomShowtimes[rTheat]);

      var randomTheatreArray = randomShowtimesArray[rTheat];

      var selectedShowDateTime = randomTheatreArray.dateTime;

      var selectedTheatre = randomTheatreArray.theatre.name;

      // console.log("Playing at this date and time: " + randomTheatreArray.dateTime);
      // console.log("Playing at this theatre: " + randomTheatreArray.theatre.name);

      return [randomTitle, selectedShowDateTime, selectedTheatre];
    }
  });
});

// Example queryURL for Gracenote API

//with the zipCode variable info get the movie theater information from the GraceNote API

//use a math.random to draw from the results to spit out a movie and movie theater selection.

//4-30-2018 -Need to create a function to pull a random movie and then a random theater and showtime for that movie

function addResultToDB(userEmail, title, showTime, theatre, zipCode) {
  var userIdRef = rootRef
    .child("users")
    .orderByChild("userId")
    .equalTo(userEmail);

  userIdRef.on("child_added", function(snap) {
    snap.ref.update({
      title: title,
      showTime: showTime,
      theatre: theatre,
      zipCode: zipCode
    });
  });
}
