/************************************
** Desktop Skip Link Functionality **
************************************/
const skipLink = document.getElementById("link-skip-to-navbar");

const navbar = document.getElementById("navbar");
const navbarLinks = document.querySelectorAll("#navbar a");
function handleDesktopSkipLinkClick() {
    navbarLinks.forEach(link => {
        link.setAttribute("tabindex", "0");
    });

    navbar.classList.add("visible");
}
navbar.addEventListener("focusout", (event) => {
    // Check if focus is leaving the navbar completely
    if (!navbar.contains(event.relatedTarget)) {
        navbarLinks.forEach(link => link.setAttribute("tabindex", "-1"));

        checkShowNavbar();
    }
});

/************************************
**  Mobile Skip Link Functionality **
************************************/
const mNavbarLinks = document.querySelectorAll("#m-overlay, #m-overlay a, #m-overlay button");
const mOverlay = document.getElementById("m-overlay");
function handleMobileSkipLinkClick() {
    mNavbarLinks.forEach(link => {
        link.setAttribute("tabindex", "0");
    });

    mOverlay.classList.add("active");

    /* Give time for the overlay to show for it to work */
    setTimeout(() => mNavbarLinks[1].focus(), 200);
}
mOverlay.addEventListener("focusout", (event) => {
    // Check if focus is leaving the navbar completely
    if (!mOverlay.contains(event.relatedTarget)) {
        mNavbarLinks.forEach(link => link.setAttribute("tabindex", "-1"));

        mOverlay.classList.remove("active");

        document.body.style.overflow = 'auto';
    }
});
function trapFocus(event) {
    const firstFocusable = mNavbarLinks[0];
    const lastFocusable = mNavbarLinks[mNavbarLinks.length - 1];

    // If "Tab" key is pressed and focus is at the first or last element
    if (event.key === "Tab") {
        if (event.shiftKey) {
            // Shift + Tab: Move focus backwards
            if (document.activeElement === firstFocusable) {
                event.preventDefault();
                lastFocusable.focus(); 
            }
        } else {
            // Tab: Move focus forwards
            if (document.activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus();
            }
        }
    }
}

/************************************
**              Utils              **
************************************/
/* Handle window resizing */
function handleResize() {
    const screenWidth = window.innerWidth;

    // Apply different behaviors based on screen size
    if (screenWidth < 900) {
        // Mobile layout behavior
        skipLink.removeEventListener("click", handleMobileSkipLinkClick);
        skipLink.addEventListener("click", handleMobileSkipLinkClick);
    } else {
        // Desktop layout behavior
        skipLink.removeEventListener("click", handleDesktopSkipLinkClick);
        skipLink.addEventListener("click", handleDesktopSkipLinkClick);
    }
}

/* On a certain scroll distance, set the main desktop navbar to be visible */
function checkShowNavbar() {
    const navbar = document.getElementById("navbar");
    const scrollDistance = 200;
    
    if (window.scrollY > scrollDistance) {
        navbar.classList.add("visible");
    } else {
        navbar.classList.remove("visible");
    }
}

/* Mobile navigation overlay when mobile navbar button clicked */
function toggleOverlay() {
    /* Toggle scrolling */
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';

    /* Toggle overlay */
    document.getElementById('m-overlay').classList.toggle('active');
}

/* Smooth scrolling to ID element with offset. Needed for cleaner look when the
navbar is fixed to the top */
function scrollWithOffset(event, targetId, focusId, offset) {
    event.preventDefault(); // Prevents the default jump behavior
    
    const targetElem = document.getElementById(targetId);
    if (targetElem) {
        const elemPos = targetElem.getBoundingClientRect().top + window.scrollY;
        const offsetPos = elemPos - offset;
        
        window.scrollTo({
            top: offsetPos,
            behavior: 'smooth'
        });
    } else {
        // If no targetId is provided, scroll to the top with offset
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const focusElem = document.getElementById(focusId);
    if (focusElem) {
        setTimeout(() => {
            focusElem.focus();
        }, 400);
    } else {
        /* If no focusId provided, reset focus to the body */
        document.body.focus();
    }
}

/************************************
**  Set Listeners & Initial Values **
************************************/
/* Listen for scroll events for the navbar */
window.addEventListener("scroll", checkShowNavbar);

/* Listen for window resize events to adjust behavior on screen width change */
window.addEventListener("resize", handleResize);

/* Any keydown in the mobile navbar overlay, trap the focus to that navbar
until released by selecting an option */
mOverlay.addEventListener("keydown", trapFocus);

/* Initial setup */
handleResize();
checkShowNavbar();