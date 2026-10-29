// mobile menu toggle

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", String(navLinks.classList.contains("active")));
    });
}

if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle("active");
        }
    });
}
