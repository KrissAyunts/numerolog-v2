
// Mobile Menu Logic
window.toggleMobileMenu = function () {
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.querySelector('.nav-toggle');

    if (navLinks && navToggle) {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        // Prevent scrolling of body when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }
};

window.closeMobileMenu = function () {
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.querySelector('.nav-toggle');

    if (navLinks && navToggle) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
};
