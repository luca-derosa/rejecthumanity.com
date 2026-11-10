// Tap or click the devlog's looping clip to pause it, again to play (Luca 2026-11-10: "Yes, tap to pause"): moving content
// that runs past 5 seconds needs a way to stop it. Keyboard: the clip takes focus, Enter or Space toggles.
for (const v of document.querySelectorAll("video.nx-clip__video")) {
  const name = v.getAttribute("aria-label") || "Clip";
  v.tabIndex = 0;
  v.setAttribute("role", "button");
  const label = () => v.setAttribute("aria-label", `${name}. ${v.paused ? "Paused: play" : "Playing: pause"}`);
  const toggle = () => { if (v.paused) v.play(); else v.pause(); };
  v.addEventListener("click", toggle);
  v.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  v.addEventListener("play", label);
  v.addEventListener("pause", label);
  label();
}
