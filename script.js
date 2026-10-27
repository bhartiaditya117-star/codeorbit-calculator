
const resultDisplay = document.getElementById("result");
const expressionDisplay = document.getElementById("expression");
const keys = document.querySelector(".keys");

let current = "0";
let stored = null;
let operator = null;
let waitingForNumber = false;
let expression = "";

function render() {
  resultDisplay.textContent = current;
  expressionDisplay.textContent = expression || "Ready to calculate";
}

function clearAll() {
  current = "0";
  stored = null;
  operator = null;
  waitingForNumber = false;
  expression = "";
  render();
}

function formatNumber(number) {
  if (!Number.isFinite(number)) return "Error";
  return String(Number(number.toPrecision(12)));
}

function inputNumber(value) {
  if (current === "Error" || waitingForNumber) {
    current = value === "." ? "0." : value;
    waitingForNumber = false;
  } else if (value === ".") {
    if (!current.includes(".")) current += ".";
  } else {
    current = current === "0" ? value : current + value;
  }
  render();
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? NaN : a / b;
    case "%": return a % b;
    default: return b;
  }
}

function chooseOperator(nextOperator) {
  if (current === "Error") return;

  const value = Number(current);

  if (operator && !waitingForNumber) {
    const answer = calculate(stored, value, operator);
    current = formatNumber(answer);

    if (current === "Error") {
      stored = null;
      operator = null;
      expression = "Cannot divide by zero";
      render();
      return;
    }
    stored = Number(current);
  } else {
    stored = value;
  }

  operator = nextOperator;
  waitingForNumber = true;
  expression = `${current} ${nextOperator}`;
  render();
}

function equals() {
  if (operator === null || stored === null || waitingForNumber) return;

  const a = stored;
  const b = Number(current);
  const op = operator;
  const answer = calculate(a, b, op);

  expression = `${a} ${op} ${b} =`;
  current = formatNumber(answer);

  if (current === "Error") {
    expression = "Cannot divide by zero";
  }

  stored = null;
  operator = null;
  waitingForNumber = true;
  render();
}

function deleteLast() {
  if (waitingForNumber || current === "Error") return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  if (current === "-") current = "0";
  render();
}

function toggleSign() {
  if (current === "0" || current === "Error") return;
  current = current.startsWith("-") ? current.slice(1) : "-" + current;
  render();
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.value !== undefined) {
    const value = button.dataset.value;
    if (/^[0-9.]$/.test(value)) inputNumber(value);
    else chooseOperator(value);
    return;
  }

  switch (button.dataset.action) {
    case "clear": clearAll(); break;
    case "delete": deleteLast(); break;
    case "sign": toggleSign(); break;
    case "equals": equals(); break;
  }
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9.]$/.test(event.key)) inputNumber(event.key);
  else if (["+", "-", "*", "/", "%"].includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") equals();
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
});

render();
