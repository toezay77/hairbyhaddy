
"use strict";

/* =========================================
   HAIR BY HADDY
   Main JavaScript
========================================= */

/*
  WHATSAPP SETUP
  Replace the placeholder with the business's real number.

  Example:
  Nigerian number: 08012345678
  International format: 2348012345678

  Use digits only: no +, spaces or hyphens.
*/

const WHATSAPP_NUMBER = "234XXXXXXXXXX";

/* SHOW A STATUS MESSAGE */

const notice = document.getElementById("site-notice");
let noticeTimeout;

function showNotice(message) {
  if (!notice) return;

  notice.textContent = message;
  notice.hidden = false;

  window.clearTimeout(noticeTimeout);

  noticeTimeout = window.setTimeout(() => {
    notice.hidden = true;
  }, 6000);
}

/* WHATSAPP ENQUIRIES */

function openWhatsApp(message) {
  const number = WHATSAPP_NUMBER.trim();

  // Do not open an invalid or placeholder number.
  if (!/^\d{10,15}$/.test(number)) {
    showNotice(
      "WhatsApp is almost ready! Add Hair by Haddy's real " +
      "business number in script.js first."
    );
    return;
  }

  const url =
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank", "noopener,noreferrer");
}

// General contact buttons.
document.querySelectorAll("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    openWhatsApp(
      "Hello Hair by Haddy! I'd like to enquire about your wigs. " +
      "Please share the available styles and prices."
    );
  });
});

// Enquiry buttons for each wig.
document.querySelectorAll("[data-order]").forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.order;

    if (!productName) {
      showNotice("Please choose a wig style first.");
      return;
    }

    openWhatsApp(
      "Hello Hair by Haddy! I'm interested in the " +
      productName +
      " wig. Please let me know the price, available lengths " +
      "and current availability."
    );
  });
});

/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("nav-links");

function closeMenu() {
  if (!menuToggle || !navigation) return;

  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");

  menuToggle.classList.remove("is-open");
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const willOpen = !navigation.classList.contains("open");

    navigation.classList.toggle("open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Close navigation" : "Open navigation"
    );

    menuToggle.classList.toggle("is-open", willOpen);
  });

  // Close the menu after a navigation link is selected.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close the menu when switching to a desktop-sized viewport.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

/* IMAGE FALLBACKS */

document.querySelectorAll(".media-frame img").forEach((image) => {
  function showImageFallback() {
    const frame = image.closest(".media-frame");
    const fallback = frame?.querySelector(".image-fallback");

    image.hidden = true;

    if (fallback) {
      fallback.hidden = false;
    }
  }

  image.addEventListener("error", showImageFallback);

  // Covers an image that failed before the handler was attached.
  if (image.complete && image.naturalWidth === 0) {
    showImageFallback();
  }
});

/* FOOTER YEAR */

const yearElement = document.getElementById("current-year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

