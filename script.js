const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const header = document.querySelector("#site-header");
const year = document.querySelector("#year");

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function activeTheme() {
  return root.dataset.theme || systemTheme();
}

function updateThemeControl() {
  const theme = activeTheme();
  const nextTheme = theme === "dark" ? "浅色" : "深色";
  themeIcon.textContent = theme === "dark" ? "☼" : "☾";
  themeToggle.setAttribute("aria-label", `切换到${nextTheme}主题`);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = activeTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;

  try {
    localStorage.setItem("theme", nextTheme);
  } catch (_) {}

  updateThemeControl();
});

window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
  if (!root.dataset.theme) updateThemeControl();
});

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
updateThemeControl();

if (year) year.textContent = new Date().getFullYear();

const initialTargetId =
  new URLSearchParams(window.location.search).get("section") || window.location.hash.slice(1);

if (initialTargetId) {
  window.setTimeout(() => {
    const target = document.getElementById(initialTargetId);
    target?.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("is-visible"));
    target?.scrollIntoView();
  }, 120);
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
