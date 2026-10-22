/*
 * sections.js — fills the page from AppData and runs the story sections. Owner: ZJ.
 *
 * Text lives in the HTML too, so the page reads fine without JS. Elements marked
 *   data-copy="path.to.text"   get their text from AppData (arrays use numbers: steps.0.title)
 *   data-href="path.to.url"    get their link from AppData
 *   data-src / data-alt        get an image source / alt text from AppData
 *   data-count="path.to.stat"  count up to stat.value (+ stat.suffix) when scrolled into view
 */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function lookup(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, window.AppData);
  }

  function applyCopy(root) {
    if (!window.AppData) return;
    root = root || document;
    [["data-copy", "textContent"], ["data-href", "href"], ["data-src", "src"], ["data-alt", "alt"]]
      .forEach(function (pair) {
        root.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
          var value = lookup(el.getAttribute(pair[0]));
          if (typeof value === "string") el[pair[1]] = value;
        });
      });
  }

  // Sets a .btn's label, including the rolled-up copy shown on hover.
  function setLabel(btn, text) {
    var roll = btn.querySelector(".btn__roll");
    if (!roll) { btn.textContent = text; return; }
    roll.firstElementChild.textContent = text;
    roll.setAttribute("data-label", text);
  }

  applyCopy(document);

  // ---- 4. How change happens: one step at a time, root line grows ----------------

  var change = document.getElementById("change");
  if (change) {
    var panels = change.querySelectorAll(".change__panel");
    var figures = change.querySelectorAll(".change__figure");
    var tabs = change.querySelectorAll(".change__tab");
    var nodes = change.querySelectorAll(".root__node");
    var root = change.querySelector(".root");
    var current = change.querySelector(".change__current");
    var next = change.querySelector(".change__next");
    var prevBtn = change.querySelector(".change__prev");
    var copy = (window.AppData && window.AppData.change) || {};
    var count = panels.length, step = 0, clearTimer = null;

    var setStep = function (n) {
      if (n === step) return;
      var prev = step;
      step = n;
      panels.forEach(function (p, i) { p.classList.toggle("is-active", i === n); });
      tabs.forEach(function (t, i) {
        if (i === n) t.setAttribute("aria-current", "step");
        else t.removeAttribute("aria-current");
      });
      clearTimeout(clearTimer);
      figures.forEach(function (f, i) {
        f.classList.toggle("was-active", i === prev);
        f.classList.toggle("is-active", i === n);
      });
      clearTimer = setTimeout(function () {
        figures.forEach(function (f) { f.classList.remove("was-active"); });
      }, 1300);
      nodes.forEach(function (node, i) { node.classList.toggle("is-on", i <= n); });
      root.style.setProperty("--p", count > 1 ? n / (count - 1) : 1);
      current.textContent = String(n + 1).padStart(2, "0");
      setLabel(next, n === count - 1 ? (copy.last || "See the impact ↓") : (copy.next || "Next step →"));
      prevBtn.disabled = n === 0;
    };

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { setStep(i); });
      // Left/right arrows move between steps (from ZJ's draft).
      t.addEventListener("keydown", function (e) {
        var to = e.key === "ArrowRight" ? step + 1 : e.key === "ArrowLeft" ? step - 1 : -1;
        if (to < 0 || to >= count) return;
        e.preventDefault();
        setStep(to);
        tabs[to].focus();
      });
    });
    prevBtn.addEventListener("click", function () { if (step > 0) setStep(step - 1); });

    // "What matters to you?": the word becomes a leaf on the root line (from ZJ's draft).
    // textContent only, so nothing typed is ever treated as HTML; nothing is stored or sent.
    var listen = change.querySelector(".listen");
    var leaves = change.querySelector(".leaves");
    var input = listen && listen.querySelector(".listen__input");
    if (listen && leaves && input) {
      if (copy.listen && copy.listen.placeholder) input.placeholder = copy.listen.placeholder;
      listen.addEventListener("submit", function (e) {
        e.preventDefault();
        var word = input.value.trim().slice(0, 24);
        if (!word) return;
        var leaf = document.createElement("li");
        leaf.className = "leaf";
        leaf.textContent = word;
        leaves.appendChild(leaf);
        if (leaves.children.length > 12) leaves.removeChild(leaves.firstChild);
        input.value = "";
        input.focus();
      });
    }
    next.addEventListener("click", function () {
      if (step < count - 1) { setStep(step + 1); return; }
      var target = document.getElementById("evidence");
      if (window.Motion) window.Motion.smooth.scrollTo(target);
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    });
    setLabel(next, copy.next || "Next step →");
    root.style.setProperty("--p", 0);
  }

  // ---- 5. Counters ------------------------------------------------------------------

  function format(n, suffix) { return Math.round(n).toLocaleString("en-GB") + (suffix || ""); }

  document.querySelectorAll("[data-count]").forEach(function (el) {
    var stat = lookup(el.getAttribute("data-count"));
    if (!stat || typeof stat.value !== "number") return;
    var finalText = format(stat.value, stat.suffix);
    el.textContent = finalText;
    if (reduce || !("IntersectionObserver" in window)) return;

    // Screen readers get the final number; the animated one is hidden from them.
    var sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = finalText;
    el.parentNode.insertBefore(sr, el);
    el.setAttribute("aria-hidden", "true");
    el.textContent = format(0, stat.suffix);

    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      var start = performance.now(), duration = 2200;
      (function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = format(stat.value * eased, stat.suffix);
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }, { threshold: 0.6 });
    io.observe(el);
  });

  // ---- 7. The ask: pick a programme, message updates, sprout grows -----------------

  var ask = document.getElementById("ask");
  if (ask) {
    var chips = ask.querySelectorAll(".pill--choice");
    var message = ask.querySelector(".ask__message");
    var template = (window.AppData && window.AppData.ask && window.AppData.ask.message) || "Help more people find programmes like {programme}.";
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        message.classList.remove("is-new");
        void message.offsetWidth; // restart the entrance animation
        message.textContent = template.replace("{programme}", chip.textContent.trim());
        message.classList.add("is-new");
        ask.classList.add("has-choice");
      });
    });
  }

  // ---- Footer: fact-check table and AI-use list (from ZJ's draft) ---------------------

  var factBody = document.querySelector(".sources .facts");
  if (factBody && window.AppData && window.AppData.facts) {
    window.AppData.facts.forEach(function (f) {
      var tr = document.createElement("tr");
      [f.claim, f.page, f.source, f.pp, f.by].forEach(function (cell) {
        var td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
      factBody.appendChild(tr);
    });
  }
  var aiList = document.querySelector(".sources .ai-use");
  if (aiList && window.AppData && window.AppData.aiUse) {
    window.AppData.aiUse.forEach(function (line) {
      var li = document.createElement("li");
      li.textContent = line;
      aiList.appendChild(li);
    });
  }

  window.Sections = { lookup: lookup, applyCopy: applyCopy, setLabel: setLabel };
})();
