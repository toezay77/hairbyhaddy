
"use strict";

/* ==================================================
   HAIR BY HADDY — COMPLETE WEBSITE JAVASCRIPT
   Works across all five HTML pages
================================================== */

/*
  BUSINESS SETUP

  Replace this placeholder with Auntie's real WhatsApp
  number in international format.

  Example:
  08012345678 -> 2348012345678

  Digits only. No + sign, spaces or hyphens.
*/

const WHATSAPP_NUMBER = "2348109423620";

const FAVOURITES_KEY = "hbh-favourites-v1";

/* ==================================================
   1. SMALL HELPER FUNCTIONS
================================================== */

function getElement(selector, root = document) {
  return root.querySelector(selector);
}

function getElements(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

/* ==================================================
   2. NOTIFICATIONS
================================================== */

let noticeTimer;

function showNotice(message, kind = "info") {
  let notice = getElement("#site-notice");

  if (!notice) {
    notice = makeElement("div", "site-notice");
    notice.id = "site-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    notice.hidden = true;

    document.body.appendChild(notice);
  }

  notice.textContent = message;
  notice.dataset.kind = kind;
  notice.hidden = false;

  window.clearTimeout(noticeTimer);

  noticeTimer = window.setTimeout(() => {
    notice.hidden = true;
  }, 5500);
}

/* ==================================================
   3. WHATSAPP ENQUIRIES
================================================== */

function openWhatsApp(message) {
  const number = WHATSAPP_NUMBER.trim();

  // Prevent opening a broken link if the number is still
  // the placeholder or was entered incorrectly.
  if (!/^\d{10,15}$/.test(number)) {
    showNotice(
      "WhatsApp is almost ready! Add Hair by Haddy's real " +
      "business number at the top of script.js first.",
      "error"
    );

    return;
  }

  const url =
    "https://wa.me/" +
    number +
    "?text=" +
    encodeURIComponent(message);

  // This is called directly by a user click, allowing the
  // browser to open the WhatsApp enquiry in a new tab.
  const newWindow = window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

  if (!newWindow) {
    showNotice(
      "Your browser blocked the new tab. Please allow pop-ups " +
      "for this website or open WhatsApp manually.",
      "error"
    );
  }
}

/* General contact buttons across all pages */

getElements("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    openWhatsApp(
      "Hello Hair by Haddy! I'd like to enquire about your wigs. " +
      "Please share the available styles, prices and details."
    );
  });
});

/* Individual wig enquiry buttons */

getElements("[data-order]").forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.order;

    if (!productName) {
      showNotice("Please choose a wig style first.", "error");
      return;
    }

    openWhatsApp(
      "Hello Hair by Haddy! I'm interested in the " +
      productName +
      " wig. Please tell me its current price, available lengths " +
      "and availability."
    );
  });
});

/* ==================================================
   4. MOBILE NAVIGATION
================================================== */

const menuToggle = getElement("#menu-toggle");
const navigation = getElement("#nav-links");

function closeMenu() {
  if (!menuToggle || !navigation) {
    return;
  }

  navigation.classList.remove("open");
  menuToggle.classList.remove("is-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const willOpen = !navigation.classList.contains("open");

    navigation.classList.toggle("open", willOpen);
    menuToggle.classList.toggle("is-open", willOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(willOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Close navigation" : "Open navigation"
    );
  });

  // Close after the customer chooses a destination.
  getElements("a", navigation).forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close if the customer clicks outside the menu.
  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("open") &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Support the Escape key.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Reset mobile navigation when returning to desktop width.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });
}

/* ==================================================
   5. AUTOMATIC ACTIVE-PAGE NAVIGATION
================================================== */

// Highlights the correct destination even if the page's
// aria-current attribute was accidentally forgotten.

function highlightCurrentPage() {
  const pathParts = window.location.pathname.split("/");
  let currentFile = pathParts[pathParts.length - 1] || "index.html";

  try {
    currentFile = decodeURIComponent(currentFile);
  } catch {
    // Keep the original path if it cannot be decoded.
  }

  if (!currentFile.includes(".")) {
    currentFile = "index.html";
  }

  getElements(".navigation a").forEach((link) => {
    let linkFile = link.getAttribute("href") || "";

    if (linkFile.includes("#")) {
      linkFile = linkFile.split("#")[0];
    }

    if (linkFile.includes("?")) {
      linkFile = linkFile.split("?")[0];
    }

    if (!linkFile) {
      return;
    }

    const matches =
      linkFile.toLowerCase() === currentFile.toLowerCase();

    if (matches) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

highlightCurrentPage();

/* ==================================================
   6. IMAGE FALLBACKS
================================================== */

// If a product image is missing or fails to load, display
// the matching fallback already included in the HTML.

function recoverImage(image) {
  if (!image || image.dataset.recovered === "true") {
    return;
  }

  image.dataset.recovered = "true";
  image.hidden = true;

  const frame = image.closest(".media-frame");
  const fallback = frame?.querySelector(".image-fallback");

  if (fallback) {
    fallback.hidden = false;
    return;
  }

  // If no custom fallback exists, display a simple one.
  if (frame) {
    const replacement = makeElement(
      "div",
      "image-fallback"
    );

    const heading = makeElement(
      "strong",
      "",
      image.alt || "Hair by Haddy"
    );

    const description = makeElement(
      "span",
      "",
      "Please check this image file."
    );

    replacement.append(heading, description);
    frame.appendChild(replacement);
  }
}

function setupImages() {
  getElements(".media-frame img").forEach((image) => {
    image.addEventListener("error", () => {
      recoverImage(image);
    });

    // Also catches an image which failed before this script ran.
    if (image.complete && image.naturalWidth === 0) {
      recoverImage(image);
    }
  });
}

setupImages();

/* ==================================================
   7. SAVE AND LOAD FAVOURITES
================================================== */

function loadFavourites() {
  try {
    const storedValue = localStorage.getItem(FAVOURITES_KEY);

    if (!storedValue) {
      return new Set();
    }

    const parsedValue = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return new Set();
    }

    return new Set(
      parsedValue.filter((value) => typeof value === "string")
    );
  } catch {
    // The website still works if storage is unavailable.
    return new Set();
  }
}

let favourites = loadFavourites();

function saveFavourites() {
  try {
    localStorage.setItem(
      FAVOURITES_KEY,
      JSON.stringify(Array.from(favourites))
    );

    return true;
  } catch {
    showNotice(
      "Your favourite couldn't be saved by this browser. " +
      "The rest of the website will still work.",
      "error"
    );

    return false;
  }
}

function getProductName(card) {
  const orderButton = getElement("[data-order]", card);

  if (orderButton?.dataset.order) {
    return orderButton.dataset.order.trim();
  }

  const heading = getElement(".product-info h2, .product-info h3", card);

  return heading ? heading.textContent.trim() : "Wig";
}

function getProductId(card) {
  return getProductName(card)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function updateFavouriteButton(button, saved, productName) {
  button.classList.toggle("is-saved", saved);
  button.setAttribute("aria-pressed", String(saved));
  button.textContent = saved ? "♥" : "♡";

  button.setAttribute(
    "aria-label",
    saved
      ? "Remove " + productName + " from favourites"
      : "Save " + productName + " to favourites"
  );

  button.title = saved
    ? "Remove from favourites"
    : "Save to favourites";
}

/* ==================================================
   8. WIG CATALOGUE: SEARCH, FILTERS AND FAVOURITES
================================================== */

function getProductCategory(card) {
  const name = getProductName(card).toLowerCase();

  if (name.includes("straight") || name.includes("bob")) {
    return "straight";
  }

  if (name.includes("curl")) {
    return "curly";
  }

  if (name.includes("wave")) {
    return "wavy";
  }

  return "other";
}

function setupCatalogue() {
  const grid = getElement(".collection-page .product-grid");

  // Only run the catalogue feature on pages which have
  // the collection page and product grid.
  if (!grid) {
    return;
  }

  const cards = getElements(".product-card", grid);

  if (cards.length === 0) {
    return;
  }

  let currentCategory = "all";
  let searchText = "";

  // Add the toolbar automatically so no extra HTML is required.
  const toolbar = makeElement("div", "catalogue-toolbar");
  toolbar.setAttribute("aria-label", "Search and filter wigs");

  const searchGroup = makeElement("div", "catalogue-search-group");

  const searchLabel = makeElement(
    "label",
    "catalogue-search-label",
    "Find your style"
  );

  searchLabel.htmlFor = "wig-search";

  const search = makeElement("input", "catalogue-search");
  search.id = "wig-search";
  search.type = "search";
  search.placeholder = "Search Bone Straight, curls, waves...";
  search.autocomplete = "off";
  search.setAttribute("aria-label", "Search wig styles");

  searchGroup.append(searchLabel, search);

  const filterGroup = makeElement("div", "catalogue-filter-group");
  const filterHeading = makeElement(
    "p",
    "catalogue-filter-heading",
    "Browse by style"
  );

  const filterButtons = makeElement(
    "div",
    "catalogue-filter-buttons"
  );

  filterButtons.setAttribute("role", "group");
  filterButtons.setAttribute("aria-label", "Wig categories");

  const categories = [
    { id: "all", label: "All wigs" },
    { id: "straight", label: "Straight & Bob" },
    { id: "curly", label: "Curly" },
    { id: "wavy", label: "Wavy" },
    { id: "saved", label: "♡ Saved (0)" }
  ];

  const chipElements = new Map();

  categories.forEach((category) => {
    const chip = makeElement(
      "button",
      "filter-chip",
      category.label
    );

    chip.type = "button";
    chip.dataset.category = category.id;
    chip.setAttribute(
      "aria-pressed",
      String(category.id === "all")
    );

    chip.addEventListener("click", () => {
      currentCategory = category.id;

      chipElements.forEach((element, id) => {
        element.setAttribute(
          "aria-pressed",
          String(id === currentCategory)
        );
      });

      applyFilters();
    });

    filterButtons.appendChild(chip);
    chipElements.set(category.id, chip);
  });

  filterGroup.append(filterHeading, filterButtons);

  const summary = makeElement(
    "p",
    "catalogue-summary",
    "Showing " + cards.length + " styles"
  );

  summary.setAttribute("aria-live", "polite");

  toolbar.append(searchGroup, filterGroup, summary);

  grid.parentElement.insertBefore(toolbar, grid);

  const emptyMessage = makeElement("div", "catalogue-empty");
  emptyMessage.hidden = true;

  const emptyHeading = makeElement(
    "strong",
    "",
    "No wigs found"
  );

  const emptyText = makeElement(
    "p",
    "",
    "Try another search or choose a different filter."
  );

  emptyMessage.append(emptyHeading, emptyText);
  grid.appendChild(emptyMessage);

  /* Add a favourite button to every wig card. */

  cards.forEach((card) => {
    const imageBox = getElement(".product-image", card);

    if (!imageBox) {
      return;
    }

    const productName = getProductName(card);
    const productId = getProductId(card);

    const favouriteButton = makeElement(
      "button",
      "product-favourite"
    );

    favouriteButton.type = "button";

    updateFavouriteButton(
      favouriteButton,
      favourites.has(productId),
      productName
    );

    favouriteButton.addEventListener("click", () => {
      const wasSaved = favourites.has(productId);

      if (wasSaved) {
        favourites.delete(productId);
      } else {
        favourites.add(productId);
      }

      updateFavouriteButton(
        favouriteButton,
        !wasSaved,
        productName
      );

      saveFavourites();
      updateSavedCount();
      applyFilters();

      showNotice(
        wasSaved
          ? productName + " removed from saved favourites."
          : productName + " saved to your favourites.",
        "success"
      );
    });

    imageBox.appendChild(favouriteButton);
  });

  function updateSavedCount() {
    const savedChip = chipElements.get("saved");

    if (savedChip) {
      savedChip.textContent = "♡ Saved (" + favourites.size + ")";
    }
  }

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const productName = getProductName(card).toLowerCase();
      const productText = card.textContent.toLowerCase();
      const productCategory = getProductCategory(card);
      const productId = getProductId(card);

      const matchesSearch =
        !searchText ||
        productName.includes(searchText) ||
        productText.includes(searchText) ||
        productCategory.includes(searchText);

      const matchesCategory =
        currentCategory === "all" ||
        (
          currentCategory === "saved" &&
          favourites.has(productId)
        ) ||
        productCategory === currentCategory;

      const isVisible = matchesSearch && matchesCategory;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    emptyMessage.hidden = visibleCount !== 0;

    if (currentCategory === "saved" && favourites.size === 0) {
      emptyHeading.textContent = "No saved favourites yet";
      emptyText.textContent =
        "Tap the heart on a wig to save it here.";
    } else if (visibleCount === 0) {
      emptyHeading.textContent = "No wigs found";
      emptyText.textContent =
        "Try another search or choose a different filter.";
    }

    summary.textContent =
      "Showing " + visibleCount +
      (visibleCount === 1 ? " style" : " styles");
  }

  search.addEventListener("input", () => {
    searchText = search.value.trim().toLowerCase();
    applyFilters();
  });

  // Reset search and filters in one click.
  const clearButton = makeElement(
    "button",
    "filter-chip",
    "Clear filters"
  );

  clearButton.type = "button";

  clearButton.addEventListener("click", () => {
    search.value = "";
    searchText = "";
    currentCategory = "all";

    chipElements.forEach((element, id) => {
      element.setAttribute(
        "aria-pressed",
        String(id === "all")
      );
    });

    applyFilters();
    search.focus();
  });

  filterButtons.appendChild(clearButton);

  updateSavedCount();
  applyFilters();
}

setupCatalogue();

/* ==================================================
   9. BACK-TO-TOP BUTTON
================================================== */

function setupBackToTop() {
  const button = makeElement(
    "button",
    "back-to-top",
    "↑"
  );

  button.type = "button";
  button.setAttribute("aria-label", "Back to top");
  button.title = "Back to top";

  document.body.appendChild(button);

  function updateBackToTop() {
    button.classList.toggle(
      "is-visible",
      window.scrollY > 450
    );
  }

  window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
  );

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });
  });

  updateBackToTop();
}

setupBackToTop();

/* ==================================================
   10. SUBTLE SCROLL REVEALS
================================================== */

// Optional animation. If the browser doesn't support
// IntersectionObserver, the content remains fully visible.

function setupScrollReveals() {
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const revealTargets = [
    ".product-card",
    ".step-card",
    ".value-card",
    ".contact-detail-card",
    ".benefit"
  ].join(",");

  const elements = getElements(revealTargets);

  if (elements.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

setupScrollReveals();

/* ==================================================
   11. CURRENT YEAR
================================================== */

getElements(".current-year").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

// Also supports the older single-element ID.
const oldYearElement = getElement("#current-year");

if (oldYearElement) {
  oldYearElement.textContent = String(new Date().getFullYear());
}

