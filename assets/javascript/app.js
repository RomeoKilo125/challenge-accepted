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
  zipCode: 0
};

$("#loginSubmit").on("click", addUser);

function addUser() {
  console.log("addUser function invoked");
  if (
    $("#inputEmail")
      .val()
      .trim() !== ""
  ) {
    userEmail = $("#inputEmail")
      .val()
      .trim();
    userObj.userId = userEmail;

    var userIdRef = rootRef
      .child("users")
      .orderByChild("userId")
      .equalTo(userEmail);

    userIdRef.on("value", function(snapshot) {
      if (snapshot.val()) {
        console.log(userEmail + " is present");
      } else {
        console.log(userEmail + " is a new user");
        var usersRef = rootRef.child("users").push();
        usersRef.set(userObj);
      }
      console.log(snapshot.val());
    });
  } else {
    alert("Come on now!! Email ID cannot be empty");
  }
}

$(window).on("load", function() {
  signOutFn();
  $("#loginModal").modal({
    backdrop: "static",
    keyboard: false
  });

  $(".initiallyHide").hide();
});

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId());
  console.log("Name: " + profile.getName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  $("#loginModal").modal("toggle");
  $(".showAgain").removeClass("hideInitially");
  $(".showAgain").show();

  var welcomMsg = $("#welcoMsg");
  welcomMsg.text("Welcome to the Adventure " + profile.getName());

  var avatarImg = $("#avatarImg");
  avatarImg.attr("src", profile.getImageUrl());
  avatarImg.attr("alt", profile.getName());

  var signOutBtn = $("#signOutBtn");
  signOutBtn.addClass("btn btn-primary");
  signOutBtn.attr("role", "button");
  signOutBtn.attr("href", "#");
  signOutBtn.text("Sign Out");

  signOutBtn.on("click", signOutFn);
}

function signOutFn() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    console.log("User signed out.");
  });

  $(".showAgain").hide();
  $(".showAgain").addClass("hideInitially");
  $("#loginModal").modal("toggle");
}
