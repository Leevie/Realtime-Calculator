$(document).ready(function() {

    // Make our variables global to the runtime of our application
    var firstDigit = 0;
    var secondDigit = 0;
    var operator = "";
    var total = 0;
    var isOperatorChosen = false;
    var isCalculated = false;

    // Use a function to initialize our calculator.
    // This way when the user hits clear, we can guarantee a reset of the app.
    function initializeCalculator() {
      firstDigit = "";
      secondDigit = "";
      operator = "";
      isOperatorChosen = false;
      isCalculated = false;

      $("#first-number, #second-number, #operator, #result").empty();
    }

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
      }

      else if (operator === "minus") {
        total = firstDigit - secondDigit;
      }

      else if (operator === "times") {
        total = firstDigit * secondDigit;
      }

      else if (operator === "divide") {
        total = firstDigit / secondDigit;
      }

      else if (operator === "power") {
        total = Math.pow(firstDigit, secondDigit);
      }

      $("#result").text(total);

    });
    $(".clear").on("click", function() {

      // Call initializeCalculater so we can reset the state of our app
      initializeCalculator();

    });

    // Call initializeCalculater so we can set the state of our app
    initializeCalculator();
  });

