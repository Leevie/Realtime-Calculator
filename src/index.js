
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


var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {

  if (snap.val()) {

    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }
});

connectionsRef.on("value", function(snap) {

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

  if (isCalculated) {
    return false;
  }

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
  if (!firstDigit || isCalculated) {
    return false;
  }

  isOperatorChosen = true;

  operator = $(this).val();

  $("#operator").text($(this).text());
});

// END Operator Click Function

// BEGIN Equal Click Function

$(".equal").on("click", function() {
  if (isCalculated) {
    return false;
  }

  isCalculated = true;

  firstDigit = parseInt(firstDigit);
  secondDigit = parseInt(secondDigit);

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
  initializeCalculator();
});

//  END Equal Click Function

$("#button-equal").on("click", function(event) {
  event.preventDefault();
  firstDigit = parseInt(firstDigit);
  secondDigit = parseInt(secondDigit);

  
  // Switch statement for operators
  switch(operator) {
    case "plus":
      operator = "+";
      break;
    case "minus":
      operator = "-";
      break;
    case "divide":
      operator = "%";
      break;
    case "times":
      operator = "x";
      break;
    case "power":
      operator = "^";
      break;        
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

});

database.ref().limitToLast(10).on("child_added", function(childSnapshot) {
  console.log("This is childSnapshot here: " + childSnapshot.val());

  var firstDigit = childSnapshot.val().firstDigit;
  var secondDigit = childSnapshot.val().secondDigit;
  var operator = childSnapshot.val().operator;
  var total = childSnapshot.val().total;

  console.log(firstDigit);
  console.log(secondDigit);
  console.log(operator);

  var newRow = $("<tr>").append(
    $("<td>").text(firstDigit),
    $("<td>").text(operator),
    $("<td>").text(secondDigit),
    $("<td>").text(total)
  );

  $("#calculator-table > tbody").append(newRow);
  
  setTimeout(function(){initializeCalculator(); }, 1000);

});
