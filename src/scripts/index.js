console.log("Script Loaded");

// Active navbar link on scroll
document.addEventListener("scroll", () => {
    const contents = document.querySelectorAll(".content");
    const navLinks = document.querySelectorAll("header nav a");

    let currentContentId = "";

    contents.forEach((content) => {
        const contentTop = content.offsetTop;
        const contentHeight = content.clientHeight;

        // Check if the section is currently in the viewport
        if (scrollY >= contentTop - contentHeight / 3) {
            currentContentId = content.getAttribute("id"); // Fixed to use 'content'
        }
    });

    // Highlight the active link based on the current section
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentContentId}`) {
            link.classList.add("active");
        }
    });
});

// Function to load content dynamically into sections
async function loadTemplate(sectionId, pageUrl) {
    const section = document.getElementById(sectionId);
    try {
        const response = await fetch(pageUrl);
        if (!response.ok) throw new Error(`Error loading ${pageUrl}`);
        
        // Clear previous content (optional)
        section.innerHTML = ""; // Clear existing content
        section.innerHTML = await response.text(); // Inject the template content
    } catch (error) {
        section.innerHTML = `<h1>Error loading section.</h1><p>${error.message}</p>`;
    }
}


// Load all templates on page load
async function loadAllTemplates() {
    const sections = ['home', 'about', 'experience', 'projects'];
    for (const section of sections) {
        await loadTemplate(section, `src/pages/${section}.html`); // Load each section template
    }
}

// Handle link navigation and load the appropriate content
function handleNavigation(event) {
    event.preventDefault(); // Prevent page reload

    const route = event.target.getAttribute("data-route");
    if (route) {
        window.history.pushState({ route }, "", `#${route}`); // Update URL

        loadTemplate(route, `src/pages/${route}.html`); // Load new content
        scrollToSection(route); // Smooth scroll to the section
    }
}

// Smooth scroll to the section
function scrollToSection(route) {
    const targetSection = document.getElementById(route);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
    }
}

// Initialize the SPA on page load
window.addEventListener("DOMContentLoaded", async () => {
    await loadAllTemplates(); // Load all section content initially

    // Attach click listeners to navbar links
    document.querySelectorAll("header nav a").forEach((link) => {
        link.addEventListener("click", handleNavigation);
    });
});

// Handle browser back/forward button navigation
window.addEventListener("popstate", (event) => {
    const route = event.state ? event.state.route : "home";
    loadTemplate(route, `src/pages/${route}.html`); // Load content based on history
    scrollToSection(route); // Ensure smooth scrolling when navigating history
});