console.log("JSlinked");

//creating an on click for submitTwo to record what's been input
var rootRef = database.ref();
var users = database.ref("users");

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

  //api.eventful.com/json/events/search?q=music&l=28282&within=10&units=miles&app_key=4D8Nvf3xRhSfBMqB

  var queryString =
    "https://api.eventful.com/json/events/search?q=music&t=" +
    date +
    "&l=" +
    zipCode +
    "&within=20&units=miles&app_key=4D8Nvf3xRhSfBMqB";

  var queryURI = encodeURIComponent(queryString);
  var cors = "http://cors-proxy.htmldriven.com/?url=";

  var queryURL = cors + queryURI;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    //console.log(response);
    var showme = JSON.parse(response.body);
    var eventsArray = showme.events.event;
    console.log(event);
    console.log(eventsArray);
    eventResults = eventChallenger();
    console.log(eventResults);

    function eventChallenger() {
      //creating a random integer to pull random events.
      var rT = Math.floor(Math.random() * eventsArray.length);
      console.log(rT);

      var randomEvent = eventsArray[rT].title;
      console.log("Your Random Event Is: " + randomEvent);

      var randomVenue = eventsArray[rT].venue_name;
      console.log("Your Venue is: " + randomVenue);

      var venueAddress = eventsArray[rT].venue_address;
      console.log("Located at: " + venueAddress);

      var venueTime = eventsArray[rT].start_time;
      console.log("Start Time: " + venueTime);

      // <iframe id="mapFrame" src="./directions.html" name="targetframe" allowtransparency="true" scrolling="no" frameborder="0"></iframe>

      var src =
        "./directions.html?source=" +
        encodeURIComponent(zipCode) +
        "&destination=" +
        encodeURIComponent(venueAddress);

      var eventTitle = $("<p>");
      eventTitle.text(randomEvent);
      eventTitle.addClass("whiteFont");

      $("#mapArea").html(
        '<iframe id="mapFrame" src=' +
          src +
          'name="targetframe" allowtransparency="true" scrolling="no" frameborder="0"></iframe>'
      );

      var eventVenue = $("<p>");
      eventVenue.text(randomVenue);
      eventVenue.addClass("whiteFont");

      var eventTime = $("<p>");
      eventTime.text(venueTime);
      eventTime.addClass("whiteFont");

      $("#mapArea").append(eventTitle);
      $("#mapArea").append(eventVenue);
      $("#mapArea").append(eventTime);

      return [randomEvent, randomVenue, venueAddress, venueTime];
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
