//Selector variables
const result = document.getElementById("result");
const display = result.firstElementChild;
const show = result.children[1];
const digits = document.getElementsByClassName("digits");
const operators = document.getElementsByClassName("operator");
const clear = digits.lastElementChild;
const calculatorClass = document.getElementsByClassName("calculator");
const calculatorId = document.getElementById("calculator");

//Javascript varibales
let numArr = []; //array to store the numbers
let signArr = []; //array to store the operators
let prevAnswer = ""; //stores the answer of the previous calculation
let prevEquation = "";
let division = "/";
let multiply = "*";
let add = "+";
let subtract = "-";
let answer = 0;
let minusFlag = false;
let clickDigit = false; // to avoid using two operators consequitively
let clickOperator = false; // flag for when operator is clicked
let displayTemp = ""; //stores the display items to check for "." repetition
let num = 0;
let newSign = "";
let minusIndex = 0;
let operatorIndex = [];
let numberIndex = [];
let equation = "";
let equalsPressed = 0;
let dotCount = 0;

//click Event listener
calculatorId.addEventListener("click", (e) => {
  //console.log(e);
  if (e.target.id != "result" && e.target.id != "display") {
    handleClick(e);
  }
});

//click event handler
function handleClick(e) {
  display.value.replace("/^0+/", "");

  if (e.target.id === "clear") {
    handleClear();
  }

  clickDigit = checkDigits(e);
  clickOperator = checkOperators(e);
  showDisplay(e, clickDigit, clickOperator);
}

//returns a boolean value after checking for a digit
function checkDigits(e) {
  //console.log(e);
  return e.target.className === "digits";
}

//returns a boolean value after checking for an operator
function checkOperators(e) {
  return e.target.className === "operator";
}

//handles what happens when 'C' is clicked
function handleClear() {
  display.value = 0;
  show.innerHTML = display.value;
  numArr = [];
  signArr = [];
  minusFlag = false;
  answer = 0;
  prevAnswer = "";
  prevEquation = "";
  equalsPressed = 0;
}

function showDisplay(e, clickDigit, clickOperator) {
  let regexNum = /[0-9.=]/;
  let regexSign = /[^0-9.]/;

  if (display.value == 0 && regexNum.test(e.target.textContent) && clickDigit) {
    //console.log("if display");
    display.value = e.target.textContent;
    show.innerHTML = display.value;
  } else if (e.target.textContent != "C") {
    //avoid "C" to appear after 0 when C is clicked
    if (e.target.textContent === ".") {
      display.value += e.target.textContent;
      var index = display.value.lastIndexOf(".");
      if (
        display.value.charAt(index - 1) === "." ||
        display.value.charAt(index - 2) === "."
      ) {
        display.value = reduceDot(display.value, index);
      }
    } else {
      display.value += e.target.textContent;
    }
    show.textContent = display.value;
  }

  if (e.target.textContent === "=") {
    equalsPressed++;
    equation = editEquation(equalsPressed);
    fillArrays(equation, regexNum, regexSign, equalsPressed);
    handleEquals(equation, regexSign);
    calculate(numArr, signArr);
    minusFlag = false;
    equation = "";
    resetArrays();
  }
}

//returns the correct equation testing the dot use cases
function reduceDot(displayValue, index) {
  if (
    displayValue.charAt(index - 1) === "." &&
    displayValue.charAt(index - 2) === "."
  ) {
    return (displayValue =
      displayValue.substring(0, index - 2) +
      displayValue.substring(index - 1, index) +
      displayValue.substring(index + 1));
  } else {
    return (displayValue =
      displayValue.substring(0, index) + displayValue.substring(index + 1));
  }
}

//edits the equation based on equalsPressed
function editEquation(equalsPressed) {
  if (equalsPressed === 1) {
    prevEquation = display.value;
    return display.value;
  } else {
    equation = display.value;
    equation = equation.substring(prevEquation.length - 1);
    return equation;
  }
}

//fills numArr and signArr
function fillArrays(equation, regexNum, regexSign, equalsPressed) {
  numArr = equation.split(regexSign);
  signArr = equation.split(regexNum);

  //checks for empty string
  function checkEmpty(sign) {
    console.log("inside checkEmpty");
    return sign != "";
  }

  numArr = numArr.filter(checkEmpty);
  signArr = signArr.filter(checkEmpty);

  if (equalsPressed > 1) {
    numArr.unshift(prevAnswer);
  }
}

//handles the logic when equal "=" is clicked
function handleEquals(equation, regexSign) {
  fillOperatorIndex(equation, regexSign);
  minusFlag = checkFlag();
  editSignArray();
  editNumArray();
}

//fills up operatorIndex array
function fillOperatorIndex(equation, regexSign) {
  for (var i = 0; i < equation.length; i++) {
    if (regexSign.test(equation[i])) {
      operatorIndex.push(i);
    }
  }
}

//retruns a boolean for minusFlag
function checkFlag() {
  for (var i = 0; i < operatorIndex.length; i++) {
    if (operatorIndex[i + 1] === operatorIndex[i] + 1) {
      return equation[operatorIndex[i]] === equation[operatorIndex[i + 1]];
    }
  }
}

//edits number and sign arrays after "=" is clicked
function editSignArray() {
  for (var i = 0; i < signArr.length; i++) {
    if (signArr[i].length > 1) {
      editSign(signArr[i], i);
    }
  }
}

// edits number Array for single character minus sign
function editNumArray() {
  for (var i = 0; i < signArr.length; i++) {
    if (signArr[i] === "-") {
      editNum(i);
    }
  }
}

//edits the signArr
function editSign(sign, index) {
  newSign = getNewSign(sign);
  signArr.splice(index, 1, newSign);
}

//returns new sign and edits the numArr when necessary
function getNewSign(sign) {
  if (sign === "-*") {
    editNum(signArr.indexOf(sign));
    return "*";
  } else if (sign === "*-") {
    editNum(signArr.indexOf(sign));
    return "*";
  } else if (sign === "/-") {
    editNum(signArr.indexOf(sign));
    return "/";
  } else if (sign === "-/") {
    editNum(signArr.indexOf(sign));
    return "/";
  } else if (sign === "+-") {
    editNum(signArr.indexOf(sign));
    return "+";
  } else if (sign === "-+") {
    editNum(signArr.indexOf(sign));
    return "-";
  } else {
    return sign.charAt(sign.length - 1);
  }
}

// edits the numArr for
function editNum(minusIndex) {
  num = numArr[minusIndex + 1];
  num = "-" + num;
  numArr.splice(minusIndex + 1, 1, num);
}

//empties out both numArr and signArr
function resetArrays() {
  numArr = [];
  signArr = [];
}

//calculates the equation and provides the result
function calculate(numArr, signArr) {
  while (signArr.indexOf("/") != -1) {
    bodmas(numArr, signArr, signArr.indexOf("/"));
  }
  while (signArr.indexOf("*") != -1) {
    bodmas(numArr, signArr, signArr.indexOf("*"));
  }
  while (signArr.indexOf("+") != -1) {
    bodmas(numArr, signArr, signArr.indexOf("+"));
  }
  while (signArr.indexOf("-") != -1) {
    bodmas(numArr, signArr, signArr.indexOf("-"));
  }
  prevAnswer = answer;
  show.innerHTML = answer;
}

//carries out the BODMAS logic for the calculator
function bodmas(numArr, signArr, i) {
  answer = operate(signArr[i], numArr[i], numArr[i + 1]);
  numArr.splice(i, 2, answer);
  signArr.splice(i, 1);
}

//carry out calculation between two values
function operate(sign, a, b) {
  if (minusFlag) {
    if (sign === "+") return Number(a) + Number(b);
    if (sign === "-") return Number(a) - Number(b);
    if (sign === "*") return Number(a) * Number(b);
    if (sign === "/") return Number(a) / Number(b);
  } else {
    if (sign === "+") return Number(a) + Number(b);
    if (sign === "-") return Number(a) + Number(b);
    if (sign === "*") return Number(a) * Number(b);
    if (sign === "/") return Number(a) / Number(b);
  }
}
