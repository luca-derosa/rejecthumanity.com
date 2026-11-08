/* Click a picture to see it full size (Luca 2026-11-08). Post pictures that are not already
   links, and the Nexus hero, open in a native <dialog>; a click anywhere, Esc or the close
   button shuts it. Without script the pictures stay as they are. */
(() => {
  const pics = document.querySelectorAll(".article__figure > img, .article__figure picture img, .nexus-hero__art img");
  if (!pics.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "zoom";
  dialog.setAttribute("aria-label", "Picture, full size");
  dialog.innerHTML = '<button class="zoom__close" type="button" aria-label="Close">×</button><img alt="">';
  document.body.append(dialog);
  const big = dialog.querySelector("img");
  let opener = null;
  const close = () => dialog.close();
  dialog.addEventListener("click", close);
  dialog.addEventListener("close", () => { big.removeAttribute("src"); if (opener) opener.focus(); });
  for (const img of pics) {
    img.classList.add("zoomable");
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `${img.alt || "Picture"}. Show full size`);
    const open = () => {
      opener = img;
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      dialog.showModal();
    };
    img.addEventListener("click", open);
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  }
})();
