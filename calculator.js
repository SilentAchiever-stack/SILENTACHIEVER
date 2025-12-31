let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';

function appendToDisplay(value) {
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        // Replace × with * for evaluation
        let expression = display.value.replace(/×/g, '*');

        // Validate the expression
        if (expression === '' || /[+\-*/]$/.test(expression)) {
            return;
        }

        // Evaluate the expression
        let result = eval(expression);

        // Handle division by zero
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }

        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;

        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

// Keyboard support
document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-') {
        appendToDisplay(key);
    } else if (key === '*') {
        appendToDisplay('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
display.value = '';