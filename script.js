const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let currentInput = '0';
let expression = '';
let shouldResetDisplay = false;

function updateDisplay() {
  expressionEl.textContent = expression || '0';
  resultEl.textContent = currentInput || '0';
}

function clearAll() {
  currentInput = '0';
  expression = '';
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length <= 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function appendNumber(value) {
  if (shouldResetDisplay) {
    currentInput = '0';
    shouldResetDisplay = false;
  }

  if (value === '.' && currentInput.includes('.')) return;

  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  updateDisplay();
}

function appendOperator(operator) {
  if (expression && /[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1) + operator;
    updateDisplay();
    return;
  }

  if (expression) {
    expression += currentInput + operator;
  } else {
    expression = currentInput + operator;
  }

  currentInput = '0';
  shouldResetDisplay = false;
  updateDisplay();
}

function calculatePercentage() {
  const number = Number(currentInput) / 100;
  currentInput = String(number);
  updateDisplay();
}

function evaluateExpression() {
  if (!expression) {
    return;
  }

  const finalExpression = expression + currentInput;
  const sanitized = finalExpression.replace(/×/g, '*').replace(/÷/g, '/');

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!Number.isFinite(result)) {
      throw new Error('Invalid calculation');
    }

    expression = finalExpression;
    currentInput = String(result);
    shouldResetDisplay = true;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    expression = '';
    shouldResetDisplay = true;
    updateDisplay();
  }
}

function handleButtonClick(event) {
  const button = event.currentTarget;
  const action = button.dataset.action;
  const value = button.dataset.value;

  if (value) {
    if (/[0-9]/.test(value) || value === '.') {
      appendNumber(value);
    } else {
      appendOperator(value);
    }
    return;
  }

  if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteLast();
  } else if (action === 'percent') {
    calculatePercentage();
  } else if (action === 'equals') {
    evaluateExpression();
  }
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key) || key === '.') {
    appendNumber(key);
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    appendOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateExpression();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key.toLowerCase() === 'c') {
    clearAll();
  }
});

updateDisplay();

