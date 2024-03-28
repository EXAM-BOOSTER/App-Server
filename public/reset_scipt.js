window.onload = function() {
    var form = document.getElementById('reset-password-form');
    var passwordInput = document.getElementById('password');
    var confirmPasswordInput = document.getElementById('confirm_password');
    var errorMessage = document.getElementById('error-message');

    // Define the regular expression for password validation
    var passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/;

    form.onsubmit = function(e) {
        var password = passwordInput.value;
        var confirmPassword = confirmPasswordInput.value;

        if (!passwordRegex.test(password)) {
            e.preventDefault();
            errorMessage.textContent = 'Password must have at least one uppercase letter, one lowercase letter, one digit, and a minimum length of 6 characters.';
        } else if (password !== confirmPassword) {
            e.preventDefault();
            errorMessage.textContent = 'Passwords do not match.';
        } else {
            errorMessage.textContent = ''; // Clear error messages if validation passes
        }
    };

    // Add a tooltip for password requirements on hover
    passwordInput.addEventListener('mouseover', function() {
        passwordInput.setAttribute('title', 'At least one uppercase letter, one lowercase letter, one digit, and a minimum length of 6 characters.');
    });

    // Clear tooltip on mouseout
    passwordInput.addEventListener('mouseout', function() {
        passwordInput.removeAttribute('title');
    });

    // Clear error message when typing in the password field
    passwordInput.addEventListener('input', function() {
        errorMessage.textContent = '';
    });

    // Clear error message when typing in the confirm password field
    confirmPasswordInput.addEventListener('input', function() {
        errorMessage.textContent = '';
    });
};