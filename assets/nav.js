// Sticky nav: on the first scroll the bar becomes a slim strip (is-stuck), once the hero
// cover has scrolled away the newest cover docks into it as a bookmark (is-docked), the current section's link lights up,
// and on a phone the links row tucks away while scrolling down and returns on the way up.
// The strip is drawn by .nav::before at a measured height (scaled, not resized, when the
// phone links tuck), so the page never shifts.
(() => {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const mark = nav.querySelector(".nav__mark");
  const dock = nav.querySelector(".nav__dock");
  const art = document.querySelector(".hero__art");
  const phone = window.matchMedia("(max-width: 60rem)");
  let lastY = window.scrollY;
  let ticking = false;

  const px = (value) => parseFloat(value) || 0;

  function measure() {
    const style = getComputedStyle(nav);
    const pad = px(style.paddingTop);
    const lift = px(style.getPropertyValue("--lift"));
    const row = Math.max(mark.offsetHeight, dock ? dock.offsetHeight : 0);
    const full = nav.offsetHeight + lift;
    nav.style.setProperty("--strip-full", `${full}px`);
    nav.style.setProperty("--strip-ratio", String(Math.min(1, (pad * 2 + row + lift) / full)));
  }

  function update() {
    ticking = false;
    const y = window.scrollY;
    const stuck = y > 8;
    const docked = art ? art.getBoundingClientRect().bottom < nav.offsetHeight : stuck;
    if (nav.classList.contains("is-stuck") !== stuck) {
      nav.classList.toggle("is-stuck", stuck);
      measure(); // the stuck bar can be shorter (one links row on a phone)
    }
    nav.classList.toggle("is-docked", docked);
    if (phone.matches && stuck) {
      if (y > lastY + 6) nav.classList.add("is-tucked");
      else if (y < lastY - 6) nav.classList.remove("is-tucked");
    } else {
      nav.classList.remove("is-tucked");
    }
    if (Math.abs(y - lastY) > 6) lastY = y;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener("resize", () => { measure(); update(); });
  measure();
  update();

  // The link for the section in view, by its hash, on the page that holds the sections.
  const links = [...nav.querySelectorAll(".nav__links a[href*='#']")];
  const sections = links
    .map((a) => document.getElementById(a.hash.slice(1)))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;
  const spy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const a of links) {
        if (a.hash === `#${entry.target.id}`) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => spy.observe(s));
  const hero = document.querySelector(".hero");
  if (hero) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) links.forEach((a) => a.removeAttribute("aria-current"));
    }, { rootMargin: "-40% 0px -55% 0px" }).observe(hero);
  }
})();
