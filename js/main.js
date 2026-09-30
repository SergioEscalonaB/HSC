/**
 * H.S.C. SERVICIOS, SUMINISTROS E INGENIERÍA S.A.S.
 * Main Interactive Application Script
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
  initHeader();
  initServiceTabs();
  initProjectFilters();
  initLightbox();
  initContactForm();
  initImageFallbacks();
  initCounterAnimations();
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
      tabButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      // Show targeted pane
      tabPanes.forEach((pane) => {
        pane.classList.remove("active");
        pane.hidden = true;
        if (pane.id === targetId) {
          pane.classList.add("active");
          pane.hidden = false;
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
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

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
  const previousBtn = modal.querySelector(".modal-nav-prev");
  const nextBtn = modal.querySelector(".modal-nav-next");
  const counter = modal.querySelector(".modal-gallery-count");
  let gallery = [];
  let galleryIndex = 0;
  let currentTitle = "";
  let currentDescription = "";

  function loadImage(source) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(source);
      image.onerror = () => resolve(null);
      image.src = source;
    });
  }

  async function findGalleryImages(source) {
    const folder = source.slice(0, source.lastIndexOf("/") + 1);
    const candidates = [source];

    // Fotos adicionales: guárdelas como foto-5.jpg, foto-6.jpg, etc.
    for (let number = 1; number <= 24; number += 1) {
      candidates.push(`${folder}foto-${number}.jpg`);
    }

    const uniqueCandidates = [...new Set(candidates)];
    const results = await Promise.all(uniqueCandidates.map(loadImage));
    return results.filter(Boolean);
  }

  function renderGalleryImage() {
    const source = gallery[galleryIndex];
    if (!source) return;

    modalImg.src = source;
    modalImg.alt = currentTitle;
    modalTitle.innerText = currentTitle;
    modalDesc.innerText = currentDescription;
    modalPath.innerText = source;
    const hasMultipleImages = gallery.length > 1;
    previousBtn.hidden = !hasMultipleImages;
    nextBtn.hidden = !hasMultipleImages;
    counter.hidden = !hasMultipleImages;
    counter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
  }

  async function openGallery(card) {
    const img = card.querySelector("img");
    if (!img) return;

    currentTitle =
      card.getAttribute("data-title") ||
      card.querySelector("h3")?.innerText ||
      "Detalle del proyecto";
    currentDescription =
      card.getAttribute("data-desc") || card.querySelector("p")?.innerText || "";
    const source = card.getAttribute("data-path") || img.currentSrc || img.src;
    gallery = await findGalleryImages(source);
    galleryIndex = Math.max(0, gallery.indexOf(source));
    renderGalleryImage();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Abre la foto seleccionada y permite recorrer las demás de su carpeta.
  document
    .querySelectorAll(".photo-card, .project-media-wrapper, .project-details-btn")
    .forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const card =
          trigger.closest(".photo-card") ||
          trigger.closest(".project-media-wrapper") ||
          trigger.closest(".project-item-card");
        if (card) openGallery(card);
      });
    });

  previousBtn?.addEventListener("click", () => {
    galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
    renderGalleryImage();
  });
  nextBtn?.addEventListener("click", () => {
    galleryIndex = (galleryIndex + 1) % gallery.length;
    renderGalleryImage();
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    if (e.key === "ArrowLeft" && modal.classList.contains("active") && gallery.length > 1) {
      galleryIndex = (galleryIndex - 1 + gallery.length) % gallery.length;
      renderGalleryImage();
    }
    if (e.key === "ArrowRight" && modal.classList.contains("active") && gallery.length > 1) {
      galleryIndex = (galleryIndex + 1) % gallery.length;
      renderGalleryImage();
    }
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
    const whatsappUrl = `https://wa.me/573001234567?text=${encodedText}`;
    window.open(whatsappUrl, "_blank", "noopener");
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
