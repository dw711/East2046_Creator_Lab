/*
 * world.js — MANI walk overlay, portal and #returned handling. Owner: Jack (J6, J7).
 * Adapted from ZJ's draft (branch zj-draft-clear-the-dark) to main's Hero / Motion hooks.
 *
 * Settings live in AppData.walk and AppData.links.maniWorld:
 *   links.maniWorld   the published MANI world URL. While it is still "#walk" the walk is
 *                     not wired up, and "Walk out of the dark spot" simply skips to #real.
 *   walk.embed        true  = the world loads inside our overlay (clean embed)
 *                     false = the world opens in a new tab (set this if Jack's J4 test shows
 *                             a blank frame or a refusal). Browsers fire the iframe's load
 *                             event even when embedding is refused, so we can't detect it.
 *
 * Coming back: the in-world portal opens OUR_URL/#returned.
 *   - inside our iframe: an inline script in <head> posts {type: "irph:returned"} to us
 *     and stops that copy of the page loading.
 *   - in a new tab or top-level: the page skips the fog and lands on #real.
 *   - in the original tab after a new-tab walk: when the visitor switches back, we land on #real.
 */
(function () {
  "use strict";

  var D = window.AppData || {};
  var cfg = D.walk || {};
  var url = (D.links && D.links.maniWorld) || "";
  var connected = url && url.charAt(0) !== "#";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MIN_ENTER = 2000, TIMEOUT = 10000;

  var walk = document.getElementById("walk");
  var frame = document.getElementById("worldFrame");
  var cover = walk && walk.querySelector(".walk__cover");
  var coverImg = walk && walk.querySelector(".walk__cover img");
  var entering = walk && walk.querySelector(".walk__entering");
  var newTab = walk && walk.querySelector(".walk__newtab");
  var hint = walk && walk.querySelector(".walk__hint");
  var portalBtn = walk && walk.querySelector(".walk__portal");
  var skipBtn = walk && walk.querySelector(".walk__skip");
  var real = document.getElementById("real");
  var doc = document.documentElement;

  var started = false, loaded = false, open = false, openedAt = 0;
  var awayInNewTab = false, timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function smooth(on) { if (window.Motion) window.Motion.smooth.stopped = !on; }

  function goReal() {
    if (window.Hero) window.Hero.dismiss();
    if (!real) return;
    if (window.Motion) window.Motion.smooth.scrollTo(real);
    else real.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    real.focus({ preventScroll: true });
  }

  // ---- Arriving on a fresh page with #returned (portal opened us top-level) -----------

  if (location.hash === "#returned") {
    if (window.Hero) window.Hero.dismiss();
    setTimeout(function () {
      if (real) window.scrollTo(0, real.getBoundingClientRect().top + window.scrollY);
      if (real) real.focus({ preventScroll: true });
    }, 50);
  }

  if (!walk || !frame || !connected) return; // not wired up yet: hero falls back to "skip"

  if (newTab) newTab.href = url;
  if (coverImg && window.Hero && window.Hero.img) coverImg.src = window.Hero.img.currentSrc || window.Hero.img.src;

  // ---- Overlay ------------------------------------------------------------------------

  function preload() {
    if (started || cfg.embed === false) return;
    started = true;
    frame.addEventListener("load", function () { loaded = true; reveal(); });
    frame.src = url;
  }

  function reveal() {
    if (!open || !loaded) return;
    var wait = Math.max(0, MIN_ENTER - (performance.now() - openedAt));
    later(function () {
      cover.classList.add("is-gone");
      hint.classList.remove("is-off");
      frame.focus();
      later(function () { hint.classList.add("is-off"); }, 7000);
    }, wait);
  }

  function openWalk() {
    if (open) return;
    open = true;
    openedAt = performance.now();
    walk.hidden = false;
    doc.classList.add("in-walk");
    smooth(false);
    requestAnimationFrame(function () { requestAnimationFrame(function () { walk.classList.add("is-open"); }); });
    cover.classList.remove("is-gone");
    hint.classList.add("is-off");
    newTab.hidden = true;
    preload();
    reveal();
    later(function () { if (!loaded) newTab.hidden = false; }, TIMEOUT);
    portalBtn.focus({ preventScroll: true });
  }

  function closeWalk() {
    clearTimers();
    if (!open) return;
    open = false;
    walk.classList.remove("is-open");
    setTimeout(function () {
      walk.hidden = true;
      doc.classList.remove("in-walk");
      smooth(true);
    }, reduce ? 0 : 600);
  }

  function arrive() {
    awayInNewTab = false;
    closeWalk();
    goReal();
  }

  function walkInNewTab() {
    awayInNewTab = true;
    window.open(url, "_blank", "noopener");
  }

  // ---- Wiring -----------------------------------------------------------------------

  if (window.Hero) {
    window.Hero.onCleared(preload);
    window.Hero.onWalk(function () {
      if (cfg.embed === false) walkInNewTab();
      else openWalk();
    });
  }

  portalBtn.addEventListener("click", arrive);
  skipBtn.addEventListener("click", arrive);
  newTab.addEventListener("click", function () { awayInNewTab = true; });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) arrive(); });
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "irph:returned") arrive();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && awayInNewTab) arrive();
  });
})();
