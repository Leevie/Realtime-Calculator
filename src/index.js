
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




// Global Variables

let firstDigit = "";
let secondDigit = "";
let operator = "";
let total = "";
let isOperatorChosen = false;
let isCalculated = false;

// BEGIN Clears Calculator

function initializeCalculator() {
  firstDigit = "";
  secondDigit = "";
  operator = "";
  isOperatorChosen = false;
  isCalculated = false;

  $("#first-number, #second-number, #operator, #result").empty();
}

// END Clears Calculator

// BEGIN Number Click Function

$(".number").on("click", function() {

  // Check if we've already run a calculation, if so... we'll just.
  if (isCalculated) {
    return false;
  }

  // If operator is chosen, we should be writing the secondNumber, otherwise, the firstNumber
  if (isOperatorChosen) {
    secondDigit += $(this).val();
    $("#second-number").text(secondDigit);

  }
  else {
    firstDigit += $(this).val();
    $("#first-number").text(firstDigit);
  }

});

// END Number Click Function

// BEGIN Operator Click Function

$(".operator").on("click", function() {
  // Check if a first number has already been selected
  // Or we've already run a calculation, if so we just exit.
  if (!firstDigit || isCalculated) {
    return false;
  }

  // Set isOperatorChosen to true so we start writing to secondNumber
  isOperatorChosen = true;

  // Store off the operator
  operator = $(this).val();

  // Set the HTML of the #operator to the text of what was clicked
  $("#operator").text($(this).text());
});

// END Operator Click Function

// BEGIN Equal Click Function

$(".equal").on("click", function() {
  // If we already clicked equal, don't do the calculation again
  if (isCalculated) {
    return false;
  }

  // Set isCalculated to true so that we don't get in a weird UI state by clicking buttons again
  isCalculated = true;

  // Use parseInt to convert our string representation of numbers into actual integers
  firstDigit = parseInt(firstDigit);
  secondDigit = parseInt(secondDigit);

  // Based on the operator that was chosen.
  // Then run the operation and set the HTML of the result of that operation
  if (operator === "plus") {
    total = firstDigit + secondDigit;
  } else if (operator === "minus") {
    total = firstDigit - secondDigit;
  } else if (operator === "times") {
    total = firstDigit * secondDigit;
  } else if (operator === "divide") {
    total = firstDigit / secondDigit;
  } else if (operator === "power") {
    total = Math.pow(firstDigit, secondDigit);
  }

  $("#result").text("= "+ total);
});

$(".clear").on("click", function() {
  // Call initializeCalculater so we can reset the state of our app
  initializeCalculator();
});

//  END Equal Click Function

$("#button-equal").on("click", function(event) {
  event.preventDefault();
  // firstDigit = parseInt($("#first-number").val());
  // secondDigit = parseInt($("#second-number").val());
  firstDigit = parseInt(firstDigit);
  secondDigit = parseInt(secondDigit);
  // operator = $(".operator").val();

  
  // Switch statement for operators
  switch($(".operator").val()) {
    case "plus":
      operator = "+";
      break;
    case "minus":
      operator = "-";
      break;
        
      }
      
      console.log("This is the Operator: "+ operator)

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
  console.log("This is childSnapshot here: " + childSnapshot.val());

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
