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
  }).then(function(response) {
    console.log(response);
  });
});

// Example queryURL for Gracenote API

//with the zipCode variable info get the movie theater information from the GraceNote API
