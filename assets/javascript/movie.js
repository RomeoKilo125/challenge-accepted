console.log("linked");

//creating an on click for submitTwo to record what's been input
var rootRef = database.ref();
var users = database.ref("users");


$("#searchSubmit").on("click", function(event) {
  event.preventDefault();

// nofify the user that we're looking for their Challenge
$('#question').text("We're looking for your challenge, keep your trousers on.")

  var zipCode = $(".zipcode")
    .val()
    .trim();
  // console.log(zipCode);
  var re = /\D/;
  // validate that zipcode is exactly 5 digits long
  if (re.test(zipCode) || zipCode.length !== 5) {
    return;
  }

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
    "&radius=10&api_key=qg7adr9qtevgagx4q4tbxbyk";

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
    console.log("desc " + movieResults[3]);
    console.log("fandango " + movieResults[4]);
    console.log("poster " + movieResults[5]);

    var movieImg = $("<img>");
    movieImg.attr("src", movieResults[5]);
    movieImg.attr("id", "poster");

    var movieTitle = $("<p>");
    movieTitle.text(title);
    movieTitle.addClass("whiteFont");

    var movieTheatre = $("<p>");
    movieTheatre.text(theatre);
    movieTheatre.addClass("whiteFont");

    var movieTime = $("<p>");
    movieTime.text(showTime);
    movieTime.addClass("whiteFont");

    var movieDesc = $("<p>");
    movieDesc.text(movieResults[3]);
    movieDesc.addClass("whiteFont");

    var buyNowBtn = $("<a>");
    buyNowBtn.attr("href", movieResults[4]);
    buyNowBtn.attr("id", "fandangoBtn");
    buyNowBtn.addClass("btn btn-info mx-auto");
    buyNowBtn.attr("role", "button");
    buyNowBtn.attr("target", "_blank");
    buyNowBtn.text("Buy via Fandango");

    var btnWrapper = $("<div>");
    buyNowBtn.addClass("mx-auto");
    btnWrapper.append(buyNowBtn);

    $("#resultArea").append(movieTitle);
    $("#resultArea").append(movieImg);
    $("#resultArea").append(movieDesc);
    $("#resultArea").append(movieTheatre);
    $("#resultArea").append(movieTime);
    $("#resultArea").append(btnWrapper);

    $("#resultArea").append("<br>");
    $("#resultArea").append("<br>");
    $("#resultArea").append("<br>");

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

      var randomDesc = selected.shortDescription;

      // store the showtimes array for the movie
      var randomShowtimesArray = selected.showtimes;

      var fandangoURL = "";

      var posterURL =
        "https://movies.tmsimg.com/" + selected.preferredImage.uri;

      //Showtime array includes the theatres.  We have to run a random number to get theatre selection.
      var selectedShowDateTime = "";
      var selectedTheatre = "";
      do {
        var rTheat = Math.floor(Math.random() * randomShowtimesArray.length);

        var randomShowtime = randomShowtimesArray[rTheat];

        randomShowtimesArray.splice(rTheat, 1);

        selectedShowDateTime = randomShowtime.dateTime;

        selectedTheatre = randomShowtime.theatre.name;

        fandangoURL = randomShowtime.ticketURI;

        var time = moment(selectedShowDateTime, "YYYY-MM-DDThh:mm");
      } while (randomShowtimesArray.length > 1 && time.diff(moment(), "mins") < 0);

      return [
        randomTitle,
        selectedShowDateTime,
        selectedTheatre,
        randomDesc,
        fandangoURL,
        posterURL
      ];
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
