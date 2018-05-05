var userEmail = "";
var config = {
  apiKey: "AIzaSyD9MW7ayHsSrRQ6P50xTLrYKKZY8JWB0Nc",
  authDomain: "challenge-accepted-405e8.firebaseapp.com",
  databaseURL: "https://challenge-accepted-405e8.firebaseio.com",
  projectId: "challenge-accepted-405e8",
  storageBucket: "",
  messagingSenderId: "783539858113"
};
firebase.initializeApp(config);
database = firebase.database();
var rootRef = database.ref();

var userObj = {
  userId: "",
  zipCode: []
};

function addUser(emailId, zipCode) {
  console.log("addUser function invoked");
  if (emailId) {
    userEmail = emailId;
    userObj.userId = userEmail;

    var userIdRef = rootRef
      .child("users")
      .orderByChild("userId")
      .equalTo(userEmail);

    userIdRef.once("value", function(snapshot) {
      if (snapshot.val()) {
        console.log(userEmail + " is present");

        var query = firebase
          .database()
          .ref("users")
          .orderByKey();
        query.once("value").then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.ref.child("zipCode").push();

            if (zipCode) {
              childData.set(zipCode);
            }
          });
        });
      } else {
        console.log(userEmail + " is a new user");
        var usersRef = rootRef.child("users").push();
        usersRef.set(userObj);
      }
    });
  } else {
    alert("Come on now!! Email ID cannot be empty");
  }
}

$(window).on("load", function() {
  $(".initiallyHide").hide();
  signOutFn();
  $("#loginModal").modal({
    backdrop: "static",
    keyboard: false
  });
});

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId());
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  addUser(profile.getEmail());

  var getLoc = function() {
    if (navigator.geolocation) {
      console.log("about to make a call to get zipcode dynamically");
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  getLoc();

  function showPosition(position) {
    console.log("making call to convert latlong to zip");
    $.ajax({
      url:
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        position.coords.latitude +
        "," +
        position.coords.longitude +
        "&key=AIzaSyB9DoXXE9yTPfe5wB8lvdaxwCUEtZxsWvs",
      method: "GET"
    }).then(function(response) {
      console.log(response.results[0].formatted_address);
      var formatted_address = response.results[0].formatted_address;
      var rx = /\d{5}(-\d{4})?/;
      var arr = formatted_address.match(rx);
      console.log(arr[0]);
      if (arr[0]) {
        $("#zipInput").val(arr[0]);
        $("#zipHelp").text("");
      }
    });
  }

  $("#loginModal").modal("toggle");
  $(".showAgain").removeClass("hideInitially");
  $(".showAgain").show();
  $("#topContainer").removeClass("onClickHidden");

  var welcomMsg = $("#welcoMsg");
  $("#welcoMsg").addClass("whiteFont");
  welcomMsg.text("Welcome to the Adventure " + profile.getName());

  var avatarImg = $("#avatarImg");
  avatarImg.attr("src", profile.getImageUrl());
  avatarImg.attr("alt", profile.getName());
  $("#avatarImg").show();

  var signOutBtn = $("#signOutBtn");
  signOutBtn.addClass("btn btn-primary");
  signOutBtn.attr("role", "button");
  signOutBtn.attr("href", "#");
  signOutBtn.text("Sign Out");

  signOutBtn.on("click", function() {
    $("#avatarImg").hide();
    signOutFn();
  });
}

function signOutFn() {
  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(function() {
      console.log("User signed out.");
      $("#avatarImg").hide();
    });
  }

  $(".showAgain").hide();
  $("#resultArea").empty();
  $("#mapArea").empty();
  $("#question").text("So what are we working with here?");
  $(".showAgain").addClass("hideInitially");
  $("#loginModal").modal("toggle");
}
