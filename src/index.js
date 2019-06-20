// var config = {
//       apiKey: "AIzaSyBfyrrmUqygTJxX-TNfAAbGOpZRcbr19uY",
//       authDomain: "recent-user-with-set-chris.firebaseapp.com",
//       databaseURL: "https://recent-user-with-set-chris.firebaseio.com",
//       projectId: "recent-user-with-set-chris",
//       storageBucket: "recent-user-with-set-chris.appspot.com",
//       messagingSenderId: "771666105922"
// };


const firebaseConfig = {
  apiKey: "AIzaSyBYRtaYDn129iRZH8Ejbk-vZUUCq-vzhtg",
  authDomain: "recalculactor.firebaseapp.com",
  databaseURL: "https://recalculactor.firebaseio.com",
  projectId: "recalculactor",
  storageBucket: "recalculactor.appspot.com",
  messagingSenderId: "696852511618",
};


firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// ------------------------------------
// BEGIN - Shows connected users...


// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connected-viewers").text("Users Connected: "+ snap.numChildren());
});

// END - Shows connected users...
// ------------------------------------




$("#button-equal").on("click", function(event) {
  event.preventDefault();

  var firstDigit = parseInt($("#firstDigit").val().trim());
  var secondDigit = parseInt($("#secondDigit").val().trim());
  var operator = $("#operator").val().trim();
  var total;

  if (operator=='+'){
    total = firstDigit + secondDigit;
  }


  var newCalc = {
    firstDigit: firstDigit,
    secondDigit: secondDigit,
    operator: operator,
    total: total
  };


  database.ref().push(newCalc);



  console.log(newCalc.firstDigit);
  console.log(newCalc.secondDigit);
  console.log(newCalc.operator);
  console.log(newCalc.total);

  // database.ref('/total').set({total: 15});

  // $("#firstDigit").val("");
  // $("#secondDigit").val("");
  // $("#operator").val("");
  // $("#total").val("");
});




database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());


  var firstDigit = childSnapshot.val().firstDigit;
  var secondDigit = childSnapshot.val().secondDigit;
  var operator = childSnapshot.val().operator;
  var total = childSnapshot.val().total;



  console.log(firstDigit);
  console.log(secondDigit);
  console.log(operator);


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(firstDigit),
    $("<td>").text(operator),
    $("<td>").text(secondDigit),
    $("<td>").text(total)
  );

  // Append the new row to the table
  $("#calculator-table > tbody").append(newRow);
});
