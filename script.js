const ICON_SUN = "\u2600\uFE0F";
const ICON_MOON = "\uD83C\uDF19";
const ICON_PAUSE = "\u23F8";

function isContentPage() {
  return document.body.classList.contains("content-page");
}

function updateThemeToggleUI(theme) {
  const themeIcon = document.getElementById("theme-icon");
  const themeText = document.getElementById("theme-text");

  if (!themeIcon || !themeText) {
    return;
  }

  const useShortLabels = isContentPage();
  themeIcon.textContent = theme === "dark" ? ICON_SUN : ICON_MOON;
  themeText.textContent = theme === "dark"
    ? (useShortLabels ? "Light" : "Light Mode")
    : (useShortLabels ? "Dark" : "Dark Mode");
}

function setTheme(theme, persist) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggleUI(theme);

  if (persist) {
    localStorage.setItem("theme", theme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(currentTheme === "dark" ? "light" : "dark", true);
}

function toggleMobileMenu() {
  const navigationMenu = document.getElementById("navMenu");
  const hamburgerIcon = document.getElementById("hamburger");

  if (!navigationMenu || !hamburgerIcon) {
    return;
  }

  navigationMenu.classList.toggle("open");
  hamburgerIcon.classList.toggle("active");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hideSuccess() {
  const formPart = document.getElementById("contact-form-part");
  const successSection = document.getElementById("contact-success");
  const form = document.getElementById("contactForm");

  if (!formPart || !successSection) {
    return;
  }

  successSection.style.display = "none";
  successSection.classList.add("hidden");
  formPart.style.display = "block";

  if (form) {
    form.reset();
  }
}

function setActiveFilterButton(clickedButton) {
  if (!clickedButton) {
    return;
  }

  const filterBar = clickedButton.closest(".filter-bar") || clickedButton.parentElement;
  if (!filterBar) {
    return;
  }

  filterBar.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.remove("active");
  });
  clickedButton.classList.add("active");
}

function filterPub(tag, clickedButton) {
  setActiveFilterButton(clickedButton);

  document.querySelectorAll("[data-filter]").forEach((item) => {
    const filters = item.dataset.filter || "";
    item.style.display = tag === "all" || filters.includes(tag) ? "" : "none";
  });
}

function filterAch(tag, clickedButton) {
  setActiveFilterButton(clickedButton);

  document.querySelectorAll(".ach-item[data-filter]").forEach((item) => {
    const filters = item.dataset.filter || "";
    item.style.display = tag === "all" || filters.includes(tag) ? "" : "none";
  });
}

function filterSection(filter, clickedButton) {
  setActiveFilterButton(clickedButton);

  const cards = Array.from(document.querySelectorAll(".eng-card"));
  const sections = Array.from(document.querySelectorAll(".eng-section"));

  if (filter === "all") {
    cards.forEach((card) => {
      card.style.display = "";
    });
    sections.forEach((section) => {
      section.style.display = "";
    });
    return;
  }

  const targets = {
    "2026": ["2026"],
    "2025": ["2025"],
    "2024": ["2024"],
    intl: ["intl"],
    policy: ["policy"],
    school: ["school"],
    community: ["community"],
  }[filter] || [];

  cards.forEach((card) => {
    const tags = card.getAttribute("data-tags") || "";
    const visible = targets.some((target) => tags.includes(target));
    card.style.display = visible ? "" : "none";
  });

  sections.forEach((section) => {
    const visibleCards = Array.from(section.querySelectorAll(".eng-card")).filter(
      (card) => card.style.display !== "none"
    );

    section.style.display = visibleCards.length > 0 ? "" : "none";

    if (section.querySelector(".eng-timeline")) {
      section.style.display = filter === "all" || filter === "2024" || filter === "policy" ? "" : "none";
    }
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const currentTheme = savedTheme || document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(currentTheme, false);
}

function initNavigation() {
  const navigationMenu = document.getElementById("navMenu");
  const hamburgerIcon = document.getElementById("hamburger");

  if (navigationMenu && hamburgerIcon) {
    navigationMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigationMenu.classList.remove("open");
        hamburgerIcon.classList.remove("active");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function handleAnchorClick(event) {
      const targetSelector = this.getAttribute("href");
      if (!targetSelector || targetSelector === "#") {
        return;
      }

      const targetElement = document.querySelector(targetSelector);
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      const targetPosition = targetElement.getBoundingClientRect().top + (window.pageYOffset || window.scrollY);
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });
}

function initClickBindings() {
  document.querySelectorAll(".theme-toggle, .theme-btn").forEach((button) => {
    button.addEventListener("click", toggleTheme);
  });

  const hamburgerButton = document.getElementById("hamburger");
  if (hamburgerButton) {
    hamburgerButton.addEventListener("click", toggleMobileMenu);
  }

  document.querySelectorAll(".success-close-btn").forEach((button) => {
    button.addEventListener("click", hideSuccess);
  });

  document.querySelectorAll("[data-filter-kind][data-filter-value]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.getAttribute("data-filter-kind");
      const value = button.getAttribute("data-filter-value");

      if (kind === "public") {
        filterPub(value, button);
      } else if (kind === "achievements") {
        filterAch(value, button);
      } else if (kind === "engagements") {
        filterSection(value, button);
      }
    });
  });
}

function initScrollNavbar() {
  const navbar = document.querySelector("nav");
  if (!navbar) {
    return;
  }

  const updateNavbar = () => {
    navbar.style.boxShadow = window.scrollY > 100 ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none";
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

function initScrollProgress() {
  const progressBar = document.getElementById("scrollProgress");
  if (!progressBar) {
    return;
  }

  const updateScrollProgress = () => {
    const scrollPositionTop = window.scrollY || document.documentElement.scrollTop || 0;
    const totalPageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = totalPageHeight > 0 ? (scrollPositionTop / totalPageHeight) * 100 : 0;
    progressBar.style.width = `${Math.max(0, Math.min(scrollPercentage, 100))}%`;
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
}

function initBackToTop() {
  const buttons = Array.from(document.querySelectorAll("#backToTop, #backToTopPg, #backToTopBtn"));
  if (!buttons.length) {
    return;
  }

  const threshold = document.body.classList.contains("page-home") ? 500 : 400;
  const updateButtons = () => {
    const showButton = window.scrollY > threshold;
    buttons.forEach((button) => {
      button.classList.toggle("visible", showButton);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", scrollToTop);
  });

  updateButtons();
  window.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);
}

function animateCounter(counterElement) {
  const targetNumber = parseInt(counterElement.getAttribute("data-target"), 10);
  const numberSuffix = counterElement.getAttribute("data-suffix") || "";

  if (Number.isNaN(targetNumber)) {
    return;
  }

  const animationDuration = 2000;
  const animationStartTime = performance.now();

  function updateCounter(currentTime) {
    const animationProgress = Math.min((currentTime - animationStartTime) / animationDuration, 1);
    const easedProgress = 1 - Math.pow(1 - animationProgress, 3);
    counterElement.textContent = `${Math.round(easedProgress * targetNumber)}${numberSuffix}`;

    if (animationProgress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

function initCounterAnimations() {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "true";
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function initRevealObserver() {
  const revealTargets = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-stagger");
  if (!revealTargets.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => observer.observe(target));
}

function initHomeCardAnimations() {
  if (!document.body.classList.contains("page-home")) {
    return;
  }

  const animatedElements = document.querySelectorAll(
    ".stat-card, .achievement-card, .initiative-card, .highlight-card, .contact-card, .engagement-card, .pillar-card"
  );

  if (!animatedElements.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
}

function initTypewriter() {
  const element = document.getElementById("typewriterEl");
  if (!element) {
    return;
  }

  const phrases = [
    "School Education · Punjab",
    "Transforming Education",
    "PP-183 Kasur-IX · PML-N",
    "Vision 2030 · Punjab",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIndex];
    element.textContent = deleting
      ? currentPhrase.slice(0, charIndex--)
      : currentPhrase.slice(0, charIndex++);

    if (!deleting && charIndex > currentPhrase.length) {
      deleting = true;
      window.setTimeout(tick, 1800);
      return;
    }

    if (deleting && charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
      window.setTimeout(tick, 400);
      return;
    }

    window.setTimeout(tick, deleting ? 45 : 75);
  }

  window.setTimeout(tick, 1200);
}

function rotateSlides(slides, activeClass, interval) {
  if (slides.length < 2) {
    if (slides[0]) {
      slides[0].classList.add(activeClass);
    }
    return;
  }

  let activeIndex = 0;
  slides.forEach((slide, index) => {
    slide.classList.toggle(activeClass, index === 0);
  });

  window.setInterval(() => {
    slides[activeIndex].classList.remove(activeClass);
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add(activeClass);
  }, interval);
}

function initAchievementSlides() {
  document.querySelectorAll(".achievement-media").forEach((mediaBlock) => {
    const slides = Array.from(mediaBlock.querySelectorAll("img"));
    if (!slides.length) {
      return;
    }

    mediaBlock.classList.remove("achievement-media-placeholder");
    const placeholderLabel = mediaBlock.querySelector("span");
    if (placeholderLabel) {
      placeholderLabel.remove();
    }

    mediaBlock.classList.add("has-slides");
    rotateSlides(slides, "is-active", 3000);
  });
}

function initGallerySlides() {
  document.querySelectorAll(".feature-image-slides").forEach((container) => {
    const slides = Array.from(container.querySelectorAll("img"));
    if (!slides.length) {
      return;
    }

    container.classList.add("has-slides");
    rotateSlides(slides, "is-active", 3000);
  });
}

function initFamilyPhotoRotation() {
  document.querySelectorAll(".family-photos").forEach((container) => {
    const photos = Array.from(container.querySelectorAll(".family-photo-img"));
    if (!photos.length) {
      return;
    }

    rotateSlides(photos, "is-active", 3000);
  });
}

function initCardSlideshows() {
  document.querySelectorAll(".card-slideshow").forEach((box) => {
    const slideSources = JSON.parse(box.getAttribute("data-slides") || "[]");
    if (!slideSources.length) {
      return;
    }

    let dotsWrap = box.querySelector(".slide-dots");
    if (!dotsWrap) {
      dotsWrap = document.createElement("div");
      dotsWrap.className = "slide-dots";
      box.appendChild(dotsWrap);
    }

    slideSources.forEach((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = "Engagement photo";
      image.loading = "lazy";
      if (index === 0) {
        image.classList.add("slide-active");
      }
      image.onerror = function handleImageError() {
        this.style.display = "none";
      };
      box.insertBefore(image, dotsWrap);

      const dot = document.createElement("div");
      dot.className = index === 0 ? "slide-dot dot-active" : "slide-dot";
      dotsWrap.appendChild(dot);
    });

    const images = Array.from(box.querySelectorAll("img"));
    const dots = Array.from(box.querySelectorAll(".slide-dot"));

    if (images.length < 2) {
      return;
    }

    let currentIndex = 0;
    window.setInterval(() => {
      images[currentIndex].classList.remove("slide-active");
      dots[currentIndex].classList.remove("dot-active");
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add("slide-active");
      dots[currentIndex].classList.add("dot-active");
    }, 3000);
  });
}

function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const isHome = document.body.classList.contains("page-home");
  const isEngagements = document.body.classList.contains("page-engagements");
  const isAchievements = document.body.classList.contains("page-achievements");

  const config = isHome ? {
    count: window.innerWidth < 768 ? 40 : 90,
    radius: [0.4, 2.2],
    velocityX: [-0.175, 0.175],
    velocityY: [-0.175, 0.175],
    alpha: [0.1, 0.7],
    goldOnly: true,
    lineDistance: 80,
    lineOpacity: 0.12,
    scatter: false,
  } : isEngagements ? {
    count: 72,
    radius: [0.6, 2.2],
    velocityX: [-0.25, 0.25],
    velocityY: [-0.35, -0.08],
    alpha: [0.15, 0.55],
    goldOnly: false,
    lineDistance: 110,
    lineOpacity: 0.12,
    scatter: true,
  } : {
    count: isAchievements ? 60 : 55,
    radius: [0.6, 2.0],
    velocityX: [-0.25, 0.25],
    velocityY: [-0.35, -0.08],
    alpha: [0.1, 0.45],
    goldOnly: false,
    lineDistance: 0,
    lineOpacity: 0,
    scatter: false,
  };

  let width = 0;
  let height = 0;
  let particles = [];

  const randomBetween = (min, max) => (Math.random() * (max - min)) + min;

  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const resetParticle = (particle) => {
    particle.x = randomBetween(0, width);
    particle.y = randomBetween(0, height);
    particle.r = randomBetween(config.radius[0], config.radius[1]);
    particle.vx = randomBetween(config.velocityX[0], config.velocityX[1]);
    particle.vy = randomBetween(config.velocityY[0], config.velocityY[1]);
    particle.alpha = randomBetween(config.alpha[0], config.alpha[1]);
    particle.gold = config.goldOnly || Math.random() > 0.55;
    if (config.scatter) {
      particle.y = randomBetween(0, height);
    }
  };

  resizeCanvas();
  particles = Array.from({ length: config.count }, () => {
    const particle = {};
    resetParticle(particle);
    return particle;
  });

  function drawParticleLines() {
    if (!config.lineDistance) {
      return;
    }

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

        if (distance < config.lineDistance) {
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(212,175,55,${(1 - (distance / config.lineDistance)) * config.lineOpacity})`;
          context.lineWidth = isHome ? 0.5 : 0.7;
          context.stroke();
        }
      }
    }
  }

  function animateParticles() {
    context.clearRect(0, 0, width, height);
    drawParticleLines();

    particles.forEach((particle) => {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      if (particle.gold || config.goldOnly) {
        context.fillStyle = `rgba(212,175,55,${particle.alpha})`;
      } else {
        context.fillStyle = `rgba(180,200,255,${particle.alpha * (isEngagements ? 0.6 : 0.5)})`;
      }
      context.fill();

      particle.x += particle.vx;
      particle.y += particle.vy;

      const outOfBounds = isHome
        ? particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height
        : particle.y < -6 || particle.x < -6 || particle.x > width + 6;

      if (outOfBounds) {
        resetParticle(particle);
      }
    });

    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", resizeCanvas);
  animateParticles();
}

function initAutoScrollButtons() {
  const AUTO_SCROLL_SPEED_PX_PER_SECOND = 60;
  const controllers = [
    { buttonId: "autoScrollBtn", backToTopId: "backToTop", contactSelector: "#contactFixedBtn", threshold: 500 },
    { buttonId: "autoScrollPg", backToTopId: "backToTopPg", contactSelector: "#contactFixedBtn", threshold: 400 },
    { buttonId: "autoScrollGalleryBtn", backToTopId: "backToTopBtn", contactSelector: "#contactFixedBtn", threshold: 400 },
  ];

  controllers.forEach((config) => {
    const button = document.getElementById(config.buttonId);
    if (!button) {
      return;
    }

    const backToTopButton = document.getElementById(config.backToTopId);
    const contactButton = document.querySelector(config.contactSelector);
    const footer = document.querySelector("footer");
    const defaultText = button.textContent.trim();
    const defaultTitle = button.title || "Auto Scroll";
    const scrollingElement = document.scrollingElement || document.documentElement;

    let active = false;
    let rafId = null;
    let lastTouchToggleTime = 0;
    let autoScrollStartedAt = 0;
    let touchStartY = null;
    let previousInlineScrollBehavior = "";
    let lastStepTime = 0;

    const getBaseBottom = (element, fallback) => {
      if (!element) {
        return fallback;
      }
      if (!element.dataset.baseBottom) {
        const computedBottom = parseFloat(window.getComputedStyle(element).bottom);
        element.dataset.baseBottom = `${Number.isFinite(computedBottom) ? computedBottom : fallback}`;
      }
      return parseFloat(element.dataset.baseBottom) || fallback;
    };

    const setScrollPosition = (top) => {
      scrollingElement.scrollTop = top;
    };

    const stop = () => {
      active = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastStepTime = 0;
      document.documentElement.style.scrollBehavior = previousInlineScrollBehavior;
      button.classList.remove("active");
      button.textContent = defaultText;
      button.title = defaultTitle;
    };

    const step = (timestamp) => {
      if (!active) return;
      const currentPosition = scrollingElement.scrollTop || window.pageYOffset || window.scrollY || 0;
      const maxScroll = scrollingElement.scrollHeight - window.innerHeight;
      if (currentPosition >= maxScroll - 2) {
        stop();
        return;
      }
      if (!lastStepTime) {
        lastStepTime = timestamp;
      }
      const elapsedSeconds = (timestamp - lastStepTime) / 1000;
      lastStepTime = timestamp;
      const distance = Math.max(AUTO_SCROLL_SPEED_PX_PER_SECOND * elapsedSeconds, 0.5);
      const nextPosition = Math.min(currentPosition + distance, maxScroll);
      setScrollPosition(nextPosition);
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      active = true;
      autoScrollStartedAt = performance.now();
      previousInlineScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      lastStepTime = 0;
      rafId = requestAnimationFrame(step);
      button.classList.add("active");
      button.textContent = ICON_PAUSE;
      button.title = "Stop Auto Scroll";
    };

    const toggle = () => {
      if (active) {
        stop();
      } else {
        start();
      }
    };

    const updateState = () => {
      const scrollTop = window.pageYOffset || window.scrollY || 0;
      const mobileContactLift = window.innerWidth <= 768 && scrollTop > config.threshold ? 10 : 0;
      if (scrollTop > config.threshold) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
        if (active) {
          stop();
        }
      }

      if (!footer) {
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleFooterHeight = Math.max(0, Math.min(footerRect.bottom, viewportHeight) - Math.max(footerRect.top, 0));
      const progressRange = Math.max(Math.min(footerRect.height, viewportHeight), 1);
      const lift = 140 * Math.max(0, Math.min(visibleFooterHeight / progressRange, 1));
      const isMobile = window.innerWidth <= 768;
      const contactLift = isMobile
        ? 40 * Math.max(0, Math.min(visibleFooterHeight / progressRange, 1))
        : lift;

      const buttonBottom = getBaseBottom(button, 32) + lift;
      button.style.bottom = `${buttonBottom}px`;

      if (backToTopButton) {
        backToTopButton.style.bottom = `${getBaseBottom(backToTopButton, 32) + lift}px`;
      }

      if (contactButton) {
        contactButton.style.bottom = `${getBaseBottom(contactButton, 95) + contactLift + mobileContactLift}px`;
        // Fade out contact button as footer becomes visible
        const footerProgress = Math.max(0, Math.min(visibleFooterHeight / progressRange, 1));
        contactButton.style.opacity = String(1 - footerProgress);
        contactButton.style.pointerEvents = footerProgress >= 0.95 ? 'none' : '';
      }
    };

    button.addEventListener("click", () => {
      if (Date.now() - lastTouchToggleTime < 500) {
        return;
      }
      toggle();
    });

    button.addEventListener("touchend", (event) => {
      event.preventDefault();
      lastTouchToggleTime = Date.now();
      toggle();
    }, { passive: false });

    window.addEventListener("wheel", () => {
      if (active) {
        stop();
      }
    }, { passive: true });

    window.addEventListener("touchstart", (event) => {
      touchStartY = event.touches[0] ? event.touches[0].clientY : null;
    }, { passive: true });

    window.addEventListener("touchmove", (event) => {
      if (!active) {
        return;
      }

      if ((performance.now() - autoScrollStartedAt) < 250) {
        return;
      }

      const currentTouchY = event.touches[0] ? event.touches[0].clientY : null;
      if (touchStartY !== null && currentTouchY !== null && Math.abs(currentTouchY - touchStartY) > 12) {
        stop();
      }
    }, { passive: true });

    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState, { passive: true });
    updateState();
  });
}

function initContactForm() {
  const form = document.getElementById("contactForm");
  const formPart = document.getElementById("contact-form-part");
  const successSection = document.getElementById("contact-success");
  const sendButton = document.getElementById("sendBtn");

  if (!form || !formPart || !successSection || !sendButton) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    sendButton.textContent = "Sending...";
    sendButton.disabled = true;

    const formData = new FormData(form);
    formData.append("_subject", "New Message from Official Website - Rana Sikandar Hayat");
    formData.append("_captcha", "false");

    try {
      const response = await fetch("https://formsubmit.co/noorhusnain792@gmail.com", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      formPart.style.display = "none";
      successSection.style.display = "block";
      successSection.classList.remove("hidden");
      window.setTimeout(hideSuccess, 5000);
    } catch (error) {
      window.alert("Something went wrong. Please try again.");
    } finally {
      sendButton.textContent = "\uD83D\uDCE4 SEND MESSAGE";
      sendButton.disabled = false;
    }
  });
}

window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.scrollToTop = scrollToTop;
window.hideSuccess = hideSuccess;
window.filterPub = filterPub;
window.filterAch = filterAch;
window.filterSection = filterSection;

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initClickBindings();
  initNavigation();
  initScrollNavbar();
  initScrollProgress();
  initBackToTop();
  initRevealObserver();
  initHomeCardAnimations();
  initCounterAnimations();
  initTypewriter();
  initAchievementSlides();
  initGallerySlides();
  initFamilyPhotoRotation();
  initCardSlideshows();
  initParticles();
  initAutoScrollButtons();
  initContactForm();
});
