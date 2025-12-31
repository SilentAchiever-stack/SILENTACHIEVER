// Simple Login Page JavaScript
// This script handles form validation and authentication logic

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function () {

    // Get references to DOM elements we'll need
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    // Predefined user credentials (in real apps, this would be handled server-side)
    const validCredentials = {
        username: 'admin',
        password: 'password123'
    };

    // Add event listener for form submission
    loginForm.addEventListener('submit', function (event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Call the login function
        handleLogin();
    });

    // Function to handle the login process
    function handleLogin() {
        // Get the values from input fields and trim whitespace
        const enteredUsername = usernameInput.value.trim();
        const enteredPassword = passwordInput.value.trim();

        // Clear any previous messages
        clearMessage();

        // Validate that both fields are filled
        if (!enteredUsername || !enteredPassword) {
            showMessage('Please fill in both username and password.', 'error');
            return;
        }

        // Check if credentials match
        if (enteredUsername === validCredentials.username &&
            enteredPassword === validCredentials.password) {

            // Successful login
            showMessage('Login successful! Welcome back.', 'success');

            // Simulate redirect after successful login (in real apps)
            setTimeout(function () {
                // You could redirect to another page here
                // window.location.href = 'dashboard.html';
                console.log('Redirecting to dashboard...');
            }, 2000);

        } else {
            // Failed login
            showMessage('Invalid username or password. Please try again.', 'error');

            // Clear the password field for security
            passwordInput.value = '';

            // Focus back to username field
            usernameInput.focus();
        }
    }

    // Function to display messages to the user
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.classList.remove('hidden');
    }

    // Function to clear/hide messages
    function clearMessage() {
        messageDiv.classList.add('hidden');
        messageDiv.textContent = '';
        messageDiv.className = 'message hidden';
    }

    // Add input event listeners for real-time validation feedback
    usernameInput.addEventListener('input', function () {
        // Clear error messages when user starts typing
        if (!messageDiv.classList.contains('hidden')) {
            clearMessage();
        }
    });

    passwordInput.addEventListener('input', function () {
        // Clear error messages when user starts typing
        if (!messageDiv.classList.contains('hidden')) {
            clearMessage();
        }
    });

    // Add keyboard event listener for Enter key
    passwordInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });

    // Focus on username field when page loads
    usernameInput.focus();
});

// Additional utility functions

// Function to validate email format (if you want to use email instead of username)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to check password strength (optional enhancement)
function checkPasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long';
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return 'Password must contain uppercase, lowercase, and numbers';
    }

    return 'strong';
}

// Function to simulate API call (for future enhancement)
async function authenticateUser(username, password) {
    // This would typically make an API call to your backend
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === 'admin' && password === 'password123') {
                resolve({ success: true, token: 'fake-jwt-token' });
            } else {
                reject({ success: false, message: 'Invalid credentials' });
            }
        }, 1000);
    });
}