document.addEventListener('DOMContentLoaded', function() {
    // Get the current year and display it in the footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Select the navigation toggle button and the mobile navigation menu
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const body = document.body;

    // Toggle mobile navigation visibility
    if (navToggle && mobileNavMenu) {
        navToggle.addEventListener('click', function() {
            body.classList.toggle('nav-open'); // Toggles a class on the body to enable/disable scroll and show/hide nav
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded); // Update ARIA attribute for accessibility
        });
    }

    // Get all navigation links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor jump behavior

            const targetId = this.getAttribute('href'); // Get the ID of the target section
            const targetElement = document.querySelector(targetId); // Select the target element

            if (targetElement) {
                // Scroll to the target element with a smooth effect
                // Adjust scroll offset based on screen width for fixed header
                window.scrollTo({
                    top: targetElement.offsetTop - (window.innerWidth < 768 ? 70 : 80), // Mobile: 70px, Desktop: 80px offset
                    behavior: 'smooth'
                });

                // If mobile navigation is open, close it after clicking a link
                if (body.classList.contains('nav-open')) {
                    body.classList.remove('nav-open');
                    if (navToggle) navToggle.setAttribute('aria-expanded', 'false'); // Reset ARIA attribute
                }
            }
        });
    });

    // Handle form submission and validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            let errorMessage = '';

            // Basic validation checks for required fields
            if (nameInput.value.trim() === '') {
                errorMessage = 'Please enter your name.';
                isValid = false;
                nameInput.focus(); // Set focus to the problematic input
            } else if (emailInput.value.trim() === '') {
                errorMessage = 'Please enter your email address.';
                isValid = false;
                emailInput.focus();
            } else if (!validateEmail(emailInput.value.trim())) { // More robust email format validation
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
                emailInput.focus();
            } else if (messageInput.value.trim() === '') {
                errorMessage = 'Please enter your message.';
                isValid = false;
                messageInput.focus();
            }

            if (!isValid) {
                e.preventDefault(); // Stop form submission if validation fails
                // Display error message using the custom message box (instead of alert)
                showMessage(errorMessage, 'error');
            } else {
                // If validation passes, the form will submit normally to Formspree.
                // You could optionally show a success message here before redirecting/reloading,
                // but Formspree typically handles the submission confirmation itself.
                // showMessage('Form submitted successfully!', 'success');
                // No e.preventDefault() here so the form actually submits.
            }
        });
    }

    /**
     * Helper function for validating email format using a regular expression.
     * @param {string} email - The email string to validate.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Displays a custom message box at the top of the screen.
     * @param {string} message - The message text to display.
     * @param {string} type - 'success' for green, 'error' for red.
     * @param {number} duration - How long the message should be visible in milliseconds.
     */
    function showMessage(message, type = 'success', duration = 3000) {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = message;
        messageBox.className = 'message-box show'; // Reset classes and add 'show'
        if (type === 'error') {
            messageBox.classList.add('error'); // Add error class for red background
        } else {
            messageBox.classList.remove('error'); // Remove error class for green background
        }

        // Hide the message after the specified duration
        setTimeout(() => {
            messageBox.classList.remove('show'); // Start fade-out animation
            // Clear message content after transition completes
            setTimeout(() => {
                messageBox.textContent = '';
            }, 300); // Wait for opacity transition (0.3s)
        }, duration);
    }
});
