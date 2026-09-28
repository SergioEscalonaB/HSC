/**
 * H.S.C. SERVICIOS, SUMINISTROS E INGENIERÍA S.A.S.
 * Main Interactive Application Script
 */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initServiceTabs();
  initProjectFilters();
  initLightbox();
  initContactForm();
  initCounterAnimations();
  initImageFallbacks();
});

/* ==========================================================================
   1. Header & Navigation
   ========================================================================== */
function initHeader() {
  const header = document.querySelector(".site-header");
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky header class on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    highlightActiveNav();
  });

  // Mobile menu toggle
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const isOpen = navMenu.classList.contains("open");
      mobileBtn.classList.toggle("is-open", isOpen);
      mobileBtn.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú" : "Abrir menú",
      );
      mobileBtn.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileBtn.classList.remove("is-open");
        mobileBtn.setAttribute("aria-label", "Abrir menú");
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active navigation link tracking
  function highlightActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY + 120;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }
}

/* ==========================================================================
   2. Service Tabs Switcher
   ========================================================================== */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".service-pane");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      // Update button active state
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show targeted pane
      tabPanes.forEach((pane) => {
        pane.classList.remove("active");
        if (pane.id === targetId) {
          pane.classList.add("active");
        }
      });
    });
  });
}

/* ==========================================================================
   3. Project Portfolio Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-item-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterValue = btn.getAttribute("data-filter");

      // Update active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards
      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Lightbox Modal
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (!modal) return;

  const modalImg = modal.querySelector(".modal-image-container img");
  const modalTitle = modal.querySelector(".modal-info-panel h3");
  const modalDesc = modal.querySelector(".modal-info-panel p");
  const modalPath = modal.querySelector(".modal-path-hint");
  const closeBtn = modal.querySelector(".modal-close-btn");

  // Open modal on photo card or zoom button click
  document
    .querySelectorAll(".photo-card, .project-details-btn")
    .forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        // Find parent or associated image
        let card =
          trigger.closest(".photo-card") ||
          trigger.closest(".project-item-card");
        if (!card) return;

        const img = card.querySelector("img");
        const title =
          card.getAttribute("data-title") ||
          card.querySelector("h3")?.innerText ||
          "Detalle del Proyecto";
        const desc =
          card.getAttribute("data-desc") ||
          card.querySelector("p")?.innerText ||
          "";
        const path =
          card.getAttribute("data-path") || img?.getAttribute("src") || "";

        if (img) {
          modalImg.src = img.src;
          modalImg.alt = title;
          modalTitle.innerText = title;
          modalDesc.innerText = desc;
          modalPath.innerText = path;
          modal.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
}

/* ==========================================================================
   5. WhatsApp Form Generator
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#contact-name").value.trim();
    const company = form.querySelector("#contact-company").value.trim();
    const service = form.querySelector("#contact-service").value;
    const phone = form.querySelector("#contact-phone").value.trim();
    const message = form.querySelector("#contact-message").value.trim();

    // Construct WhatsApp message
    let text = `*SOLICITUD DE COTIZACIÓN - HSC*\n\n`;
    text += `*Nombre:* ${name}\n`;
    if (company) text += `*Empresa:* ${company}\n`;
    text += `*Servicio de interés:* ${service}\n`;
    text += `*Teléfono:* ${phone}\n`;
    if (message) text += `*Mensaje:* ${message}\n`;

    const encodedText = encodeURIComponent(text);
    // WhatsApp number (Brochure phone: 034 233 4564 or international Colombian phone format +57)
    const whatsappUrl = `https://wa.me/573001234567?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
  });
}

/* Keep missing editorial photography intentional until the real files arrive. */
function initImageFallbacks() {
  document.querySelectorAll(".photo-slot img").forEach((image) => {
    const markAsMissing = () => {
      image.hidden = true;
      image.closest(".photo-slot")?.classList.add("image-missing");
    };

    image.addEventListener("error", markAsMissing);
    if (image.complete && image.naturalWidth === 0) markAsMissing();
  });
}

/* ==========================================================================
   6. Stats Counter Animations
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll(".counter-val");
  let animated = false;

  function runCounters() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 1500;
      const step = Math.ceil(target / (duration / 30));
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.innerText = target;
          clearInterval(timer);
        } else {
          counter.innerText = current;
        }
      }, 30);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          runCounters();
        }
      });
    },
    { threshold: 0.4 },
  );

  const statsSection = document.querySelector(".stats-strip");
  if (statsSection) observer.observe(statsSection);
}
