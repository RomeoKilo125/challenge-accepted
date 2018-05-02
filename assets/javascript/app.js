// Initialize Firebase
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

$(window).on('load', function() {
  $('#loginModal').modal('show');
});
