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
    const revealTargets = [
      ...document.querySelectorAll(
        ".hero-copy, .hero-aside, .section-heading, .prose, .facts, .section-intro, .interest-card, .empty-state, .project, .all-projects, .contact-inner"
      ),
    ];
    revealTargets.forEach((element) => element.classList.add("reveal"));
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
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    revealTargets.forEach((element) => observer.observe(element));
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
