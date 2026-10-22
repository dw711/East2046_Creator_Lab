/*
 * motion.js — the page's motion layer. Owner: ZJ.
 * Original code, no libraries. Inspired by award-site conventions (see README credits).
 *
 *   Preloader     000% counter tied to real image/font loading, then a curtain wipe up
 *   Smooth scroll inertial wheel scrolling on desktop (native scroll on touch/reduced motion)
 *   Cursor        dot + trailing ring; grows on links; shows a label over [data-cursor]
 *   Reveals       .split (word-by-word rise), .fade-up, .media (clip-path wipe)
 *   Magnetic      .magnetic elements lean towards the pointer
 *   Theme         html[data-theme] follows the section in the middle of the viewport
 *   Marquee       programme names, speed and skew react to scroll velocity
 *
 * For world.js: set Motion.smooth.stopped = true while the MANI overlay is open
 * (so the wheel goes to the 3D world), and back to false when it closes.
 */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var returned = location.hash === "#returned";

  // ---- Split text into words ------------------------------------------------
  // Screen readers get the sentence once from a hidden copy; the animated words are hidden.

  function split(el) {
    if (el.getAttribute("data-split")) return;
    el.setAttribute("data-split", "1");
    var label = el.textContent.replace(/\s+/g, " ").trim();
    var i = 0;

    function wordSpan(child) {
      var outer = document.createElement("span");
      outer.className = "w";
      outer.setAttribute("aria-hidden", "true");
      child.style.setProperty("--i", i++);
      outer.appendChild(child);
      return outer;
    }

    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var inner = document.createElement("span");
            inner.textContent = part;
            frag.appendChild(wordSpan(inner));
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          if (child.classList.contains("arrow")) node.replaceChild(wordSpan(child.cloneNode(true)), child);
          else walk(child);
        }
      });
    })(el);

    var sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = label;
    el.appendChild(sr);
  }

  document.querySelectorAll(".split").forEach(split);

  // Buttons: the rolled-up copy of the label comes from data-label.
  document.querySelectorAll(".btn__roll").forEach(function (roll) {
    roll.setAttribute("data-label", roll.firstElementChild.textContent);
  });

  // ---- Scroll reveals ---------------------------------------------------------

  var revealTargets = Array.prototype.filter.call(
    document.querySelectorAll(".split, .fade-up, .media"),
    function (el) { return !el.closest(".hero"); }
  );

  if (reduce || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revealTargets.forEach(function (el) { revealer.observe(el); });
  }

  // ---- Preloader ----------------------------------------------------------------

  var pre = document.querySelector(".preloader");

  function heroIntro() {
    var t = document.querySelector(".hero__title");
    if (t) t.classList.add("is-in");
  }

  function loaded() {
    doc.classList.remove("is-loading");
    doc.classList.add("is-loaded");
  }

  if (!pre || reduce || returned) {
    if (pre) pre.remove();
    loaded();
    heroIntro();
  } else {
    doc.classList.add("is-loading");
    var num = pre.querySelector(".preloader__num");
    var bar = pre.querySelector(".preloader__bar span");
    var waits = Array.prototype.filter.call(document.images, function (im) { return im.loading !== "lazy"; });
    var total = waits.length + 1, done = 0;
    var tickOne = function () { done++; };
    waits.forEach(function (im) {
      if (im.complete) done++;
      else { im.addEventListener("load", tickOne, { once: true }); im.addEventListener("error", tickOne, { once: true }); }
    });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(tickOne, tickOne);

    var shown = 0, start = performance.now(), MIN = 1500, MAX = 5000;
    var count = function (now) {
      var t = now - start;
      var target = t > MAX ? 100 : Math.min(done / total * 100, t / MIN * 100);
      shown += (target - shown) * 0.09;
      if (target - shown < 0.4) shown = target;
      num.textContent = String(Math.round(shown)).padStart(3, "0");
      bar.style.transform = "scaleX(" + (shown / 100) + ")";
      if (shown >= 100) {
        setTimeout(function () {
          pre.classList.add("is-done");
          loaded();
          setTimeout(heroIntro, 450);
          setTimeout(function () { pre.remove(); }, 1300);
        }, 250);
      } else {
        requestAnimationFrame(count);
      }
    };
    requestAnimationFrame(count);
  }

  // ---- Smooth scroll (wheel only; keyboard, touch and scrollbar stay native) -------

  var smooth = { enabled: fine && !reduce, stopped: false };
  var sTarget = window.scrollY, sCurrent = window.scrollY, sRunning = false;

  function maxScroll() { return doc.scrollHeight - window.innerHeight; }

  function smoothStep() {
    sCurrent += (sTarget - sCurrent) * 0.085;
    if (Math.abs(sTarget - sCurrent) < 0.5) { sCurrent = sTarget; sRunning = false; }
    window.scrollTo(0, sCurrent);
    if (sRunning) requestAnimationFrame(smoothStep);
  }

  function smoothTo(y) {
    if (!sRunning) { sTarget = sCurrent = window.scrollY; }
    sTarget = Math.max(0, Math.min(maxScroll(), y));
    if (!sRunning) { sRunning = true; requestAnimationFrame(smoothStep); }
  }

  window.addEventListener("wheel", function (e) {
    if (!smooth.enabled || smooth.stopped || e.ctrlKey || doc.classList.contains("is-loading")) return;
    if (e.target.closest && e.target.closest("[data-native-scroll]")) return;
    e.preventDefault();
    var d = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
    smoothTo((sRunning ? sTarget : window.scrollY) + d);
  }, { passive: false });

  window.addEventListener("scroll", function () {
    if (!sRunning) sTarget = sCurrent = window.scrollY;
  }, { passive: true });

  smooth.scrollTo = function (target) {
    var y = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
    if (smooth.enabled && !smooth.stopped) smoothTo(y);
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  // In-page links glide instead of jumping, then move focus for keyboard users.
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var el = id && id !== "walk" && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    smooth.scrollTo(id === "hero" ? 0 : el);
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  });

  // ---- Cursor ------------------------------------------------------------------------

  var cursor = document.querySelector(".cursor");
  if (fine && cursor) {
    doc.classList.add("has-cursor");
    var ring = cursor.querySelector(".cursor__ring");
    var dot = cursor.querySelector(".cursor__dot");
    var label = cursor.querySelector(".cursor__label");
    var mx = -100, my = -100, rx = -100, ry = -100, hoverEl = null;

    var setHover = function (el) {
      if (el === hoverEl) return;
      hoverEl = el;
      var text = el && el.getAttribute("data-cursor");
      cursor.classList.toggle("has-label", !!text);
      cursor.classList.toggle("is-hover", !!el && !text);
      if (text) label.textContent = text;
    };

    window.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      cursor.classList.add("is-visible");
      var t = e.target.closest ? e.target.closest("[data-cursor], a, button, .pill") : null;
      if (t && t.matches("[data-cursor]") && t.offsetParent === null) t = null;
      setHover(t);
    }, { passive: true });
    window.addEventListener("pointerdown", function () { cursor.classList.add("is-down"); });
    window.addEventListener("pointerup", function () { cursor.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { cursor.classList.remove("is-visible"); });
    window.addEventListener("blur", function () { cursor.classList.remove("is-visible"); });

    var follow = function () {
      rx += (mx - rx) * (reduce ? 1 : 0.16);
      ry += (my - ry) * (reduce ? 1 : 0.16);
      ring.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);
  }

  // ---- Magnetic elements ------------------------------------------------------------

  if (fine && !reduce) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var rect = null;
      var pull = el.classList.contains("btn--xl") ? 0.32 : 0.24;
      el.addEventListener("pointerenter", function () {
        el.style.transform = "";
        rect = el.getBoundingClientRect();
        el.classList.add("is-magnet");
      });
      el.addEventListener("pointermove", function (e) {
        if (!rect) return;
        var x = e.clientX - (rect.left + rect.width / 2);
        var y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = "translate3d(" + (x * pull) + "px," + (y * pull * 1.3) + "px,0)";
      });
      el.addEventListener("pointerleave", function () {
        rect = null;
        el.classList.remove("is-magnet");
        el.style.transform = "";
      });
    });
  }

  // ---- Theme follows the section in the middle of the screen --------------------------

  doc.setAttribute("data-theme", "dark");
  if ("IntersectionObserver" in window) {
    var themer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) doc.setAttribute("data-theme", entry.target.getAttribute("data-theme"));
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    document.querySelectorAll("main [data-theme], footer[data-theme]").forEach(function (el) { themer.observe(el); });
  }

  // ---- Marquee -------------------------------------------------------------------------

  var marquee = document.querySelector(".marquee");
  var track = marquee && marquee.querySelector(".marquee__track");
  var marqueeOn = false, mX = 0, groupW = 0;
  if (track) {
    var names = Array.prototype.map.call(document.querySelectorAll(".index-list__text"), function (n) { return n.textContent; });
    var group = function () {
      var g = document.createElement("div");
      g.className = "marquee__group";
      names.forEach(function (name) {
        var item = document.createElement("span");
        item.className = "marquee__item";
        item.textContent = name;
        var sep = document.createElement("span");
        sep.className = "marquee__sep";
        sep.textContent = "✺";
        g.appendChild(item);
        g.appendChild(sep);
      });
      return g;
    };
    track.appendChild(group());
    track.appendChild(group());
    var measure = function () { groupW = track.firstElementChild.getBoundingClientRect().width; };
    measure();
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if (!reduce && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) { marqueeOn = entries[0].isIntersecting; }).observe(marquee);
    }
  }

  // ---- One frame loop for scroll-linked effects -----------------------------------------

  var bar2 = document.querySelector(".progress span");
  var header = document.querySelector(".site-header");
  var parallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var lastY = window.scrollY, velocity = 0, lastT = performance.now();

  function frame(now) {
    var y = window.scrollY;
    var dt = Math.min(64, now - lastT) / 16.67;
    lastT = now;
    velocity += ((y - lastY) - velocity) * 0.2;

    if (bar2) bar2.style.transform = "scaleX(" + (maxScroll() > 0 ? y / maxScroll() : 0) + ")";
    if (header) header.classList.toggle("is-hidden", y > window.innerHeight && y - lastY > 2);
    if (header && y - lastY < -2) header.classList.remove("is-hidden");
    lastY = y;

    if (!reduce) {
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        var k = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        var img = el.querySelector("img");
        if (img) img.style.setProperty("--py", (-p * r.height * k).toFixed(1) + "px");
      });
    }

    if (marqueeOn && groupW) {
      mX -= (1.1 + Math.min(18, Math.abs(velocity) * 0.35)) * dt;
      if (mX <= -groupW) mX += groupW;
      var skew = Math.max(-10, Math.min(10, velocity * -0.25));
      track.style.transform = "translate3d(" + mX.toFixed(2) + "px,0,0) skewX(" + skew.toFixed(2) + "deg)";
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.Motion = { smooth: smooth, split: split, reduce: reduce };
})();
