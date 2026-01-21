
// Helper: safe query
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));


// =========================
// Mobile nav toggle
// =========================
(() => {
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");

  if (!header || !toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.contains("is-open");
    setOpen(!isOpen);
  });

  // Close menu when a nav link is clicked (mobile UX)
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    setOpen(false);
  });

  // Close menu on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Close on resize to desktop to avoid stuck states
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 981px)").matches) setOpen(false);
  });
})();

// =========================
// Smooth scrolling with sticky-header offset
// - Keeps native smooth scroll when possible
// - Adds offset so headings aren't hidden under the sticky header
// =========================
(() => {
  const header = $(".site-header");
  const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollToHash = (hash) => {
    if (!hash || hash === "#") return;
    const target = document.getElementById(hash.replace("#", ""));
    if (!target) return;

    const y = window.scrollY + target.getBoundingClientRect().top - headerHeight() - 10;
    window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  // Intercept in-page anchor links
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const url = new URL(link.href);
    if (url.pathname !== window.location.pathname) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    e.preventDefault();
    scrollToHash(hash);
    history.pushState(null, "", hash);
  });

  // Handle back/forward hash navigation
  window.addEventListener("popstate", () => scrollToHash(window.location.hash));
})();

// =========================
// Scroll-reveal animations (subtle, no libraries)
// Adds .reveal to major blocks and toggles .is-visible on intersection.
// =========================
(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const candidates = [
    ".section-head",
    ".panel",
    ".skill-card",
    ".project-card",
    ".hero-copy",
    ".hero-card",
  ];

  const elements = candidates.flatMap((sel) => $$(sel)).filter(Boolean);
  elements.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target); // one-time reveal
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => io.observe(el));
})();

// =========================
// Active nav link while scrolling (IntersectionObserver)
// =========================
(() => {
  const links = $$(".site-nav a.nav-link");
  if (!links.length) return;

  const sections = links
    .map((a) => a.getAttribute("href"))
    .filter((href) => href && href.startsWith("#") && href.length > 1)
    .map((href) => document.getElementById(href.slice(1)))
    .filter(Boolean);

  const linkById = new Map(links.map((a) => [a.getAttribute("href")?.slice(1), a]));

  const clearActive = () => links.forEach((a) => a.classList.remove("is-active"));
  const setActive = (id) => {
    clearActive();
    const a = linkById.get(id);
    if (a) a.classList.add("is-active");
  };

  const io = new IntersectionObserver(
    (entries) => {
      // Find the most visible intersecting section
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActive(visible.target.id);
    },
    {
      // More forgiving for short sections
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0.06, 0.12, 0.2],
    }
  );

  sections.forEach((s) => io.observe(s));
})();

