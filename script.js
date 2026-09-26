(() => {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.hash));

  let scrollQueued = false;
  const updateScrollState = () => {
    scrollQueued = false;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = pageHeight > 0 ? Math.min(1, window.scrollY / pageHeight) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    header.classList.toggle("is-scrolled", window.scrollY > 8);

    let currentSection = null;
    sections.forEach((section) => {
      if (section && section.getBoundingClientRect().top < window.innerHeight * 0.38) {
        currentSection = section;
      }
    });
    navLinks.forEach((link, index) => {
      if (sections[index] === currentSection) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        window.requestAnimationFrame(updateScrollState);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateScrollState, { passive: true });
  updateScrollState();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = new Set();
    const registerReveal = (selector, effectClass, step = 70, initialDelay = 0) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("reveal", effectClass);
        element.style.setProperty("--reveal-delay", `${initialDelay + index * step}ms`);
        revealTargets.add(element);
      });
    };

    registerReveal(".hero-copy", "reveal-pop", 0, 40);
    registerReveal(".hero-aside", "reveal-float", 0, 140);
    registerReveal(".section-heading", "reveal-slide-right", 80);
    registerReveal(".prose, .facts, .section-intro", "reveal-up", 90);
    registerReveal(".interest-card", "reveal-pop", 90, 70);
    registerReveal(".empty-state, .contact-inner", "reveal-zoom", 0, 90);
    registerReveal(".project", "reveal-pop", 80, 60);
    registerReveal(".all-projects", "reveal-up", 0, 120);

    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    [...revealTargets].forEach((element) => observer.observe(element));
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".interest-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    });
  }
})();
