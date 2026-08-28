const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
});

navLinks?.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navLinks.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "打开导航");
});

const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const current = entries.find((entry) => entry.isIntersecting);
      if (!current) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${current.target.id}`;
        if (active) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-25% 0px -65%", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

const copyIcon = `
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <rect width="14" height="14" x="8" y="8" rx="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  </svg>`;
const checkIcon = `
  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="m20 6-11 11-5-5"></path>
  </svg>`;

async function writeToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through for browsers that expose Clipboard API without granting access.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy command failed");
}

document.querySelectorAll("[data-copy-bibtex]").forEach((button) => {
  button.addEventListener("click", async () => {
    const bibtex = button.closest(".bibtex-content")?.querySelector("pre")?.textContent;
    if (!bibtex) return;

    try {
      await writeToClipboard(bibtex);
      button.innerHTML = checkIcon;
      button.classList.add("is-copied");
      button.setAttribute("aria-label", "BibTeX copied");
      button.setAttribute("title", "BibTeX copied");
      window.setTimeout(() => {
        button.innerHTML = copyIcon;
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", "Copy BibTeX");
        button.setAttribute("title", "Copy BibTeX");
      }, 1600);
    } catch {
      button.setAttribute("aria-label", "Unable to copy BibTeX");
      button.setAttribute("title", "Unable to copy BibTeX");
    }
  });
});
