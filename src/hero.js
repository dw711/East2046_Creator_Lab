/*
 * hero.js — the fog hero. Owner: ZJ (Z1).
 *
 * The visitor drags to wipe dark fog off the spawn-view image. Once enough is cleared
 * (AppData.hero.clearThreshold) the fog dissolves, the quote appears, and after
 * AppData.hero.buttonsDelay seconds the "Walk" / "Skip" buttons appear.
 *
 * State lives on #hero as data-state: fog → dissolving → clear → actions.
 * With JS off there is no data-state, so CSS shows the image, quote and buttons with no fog.
 *
 * Public hooks (for world.js):
 *   Hero.onWalk(fn)     fn(event) on "Walk out of the dark spot". Registering a handler
 *                       cancels the link's default navigation.
 *   Hero.onSkip(fn)     fn(event) on "Skip the walk". Default (jump to #real) still runs
 *                       unless fn calls event.preventDefault().
 *   Hero.onCleared(fn)  fn() once the fog has dissolved (start preloading the world here).
 *   Hero.dismiss()      no fog, no waiting: quote and buttons straight away (for #returned).
 *   Hero.reset()        bring the fog back (handy between demo runs).
 *   Hero.img            the spawn-view <img>, for the zoom-and-fade.
 */
(function () {
  "use strict";

  var hero = document.getElementById("hero");
  var canvas = hero && hero.querySelector(".hero__fog");
  var ctx = canvas && canvas.getContext && canvas.getContext("2d");
  if (!ctx) return; // no canvas: the no-JS layout stays as it is

  var img = hero.querySelector(".hero__img");
  var title = hero.querySelector(".hero__title");
  var autoBtn = hero.querySelector(".hero__auto");
  var walkBtn = hero.querySelector(".hero__walk");
  var skipBtn = hero.querySelector(".hero__skip");
  var quote = hero.querySelector(".hero__quote");

  var data = (window.AppData && window.AppData.hero) || {};
  var threshold = data.clearThreshold || 0.45;
  var buttonsDelay = (data.buttonsDelay != null ? data.buttonsDelay : 3) * 1000;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (window.matchMedia("(pointer: coarse)").matches && data.promptTouch) {
    title.textContent = data.promptTouch;
  }

  var handlers = { walk: [], skip: [], cleared: [] };

  // ---- Sizing -------------------------------------------------------------

  var W = 0, H = 0, dpr = 1, radius = 60, brush = null;
  var stamps = [];               // every brush stamp, as 0–1 coordinates, so resize can replay
  var GRID_X = 48, gridY = 27;   // coarse coverage grid: cheap to update, no getImageData
  var grid = null, clearedCells = 0;
  var state = "fog";

  function setup() {
    var rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    radius = Math.max(36, Math.min(110, Math.min(W, H) * 0.085));
    brush = makeBrush();

    gridY = Math.max(1, Math.round(GRID_X * H / W));
    grid = new Uint8Array(GRID_X * gridY);
    clearedCells = 0;

    drawFog();
    ctx.globalCompositeOperation = "destination-out";
    stamps.forEach(function (s) {
      stamp(s.x * W, s.y * H);
      markGrid(s.x * W, s.y * H);
    });
  }

  // ---- Drawing ------------------------------------------------------------

  // Seeded so the fog looks the same on every load and every resize.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Three tiny random textures, stretched to full size, stack into soft smoke.
  var noise = (function () {
    var rand = mulberry32(2046);
    return [[16, 9, 0.45], [40, 23, 0.25], [110, 62, 0.12]].map(function (o) {
      var c = document.createElement("canvas");
      c.width = o[0]; c.height = o[1];
      var x = c.getContext("2d");
      var d = x.createImageData(o[0], o[1]);
      for (var i = 0; i < d.data.length; i += 4) {
        var v = rand();
        d.data[i] = 110; d.data[i + 1] = 124; d.data[i + 2] = 118;
        d.data[i + 3] = Math.round(v * v * 255);
      }
      x.putImageData(d, 0, 0);
      return { canvas: c, alpha: o[2] };
    });
  })();

  function drawFog() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.clearRect(0, 0, W, H);

    // A touch lighter in the middle so a faint glow of the garden shows through.
    var g = ctx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H * 0.55, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(34, 41, 38, 0.95)");
    g.addColorStop(1, "rgba(12, 15, 14, 1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.filter = "blur(" + Math.round(Math.min(W, H) / 60) + "px)"; // ignored where unsupported
    noise.forEach(function (n) {
      ctx.globalAlpha = n.alpha;
      ctx.drawImage(n.canvas, -W * 0.05, -H * 0.05, W * 1.1, H * 1.1);
    });
    ctx.filter = "none";
    ctx.globalAlpha = 1;
  }

  function makeBrush() {
    var size = Math.ceil(radius * 2 * dpr);
    var c = document.createElement("canvas");
    c.width = c.height = size;
    var b = c.getContext("2d");
    var g = b.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.5, "rgba(0,0,0,0.8)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    b.fillStyle = g;
    b.fillRect(0, 0, size, size);
    return c;
  }

  function stamp(x, y) {
    ctx.drawImage(brush, x - radius, y - radius, radius * 2, radius * 2);
  }

  // Mark grid cells whose centre sits well inside the brush (the soft edge doesn't count).
  function markGrid(x, y) {
    var cw = W / GRID_X, ch = H / gridY, r = radius * 0.7, r2 = r * r;
    var x0 = Math.max(0, Math.floor((x - r) / cw)), x1 = Math.min(GRID_X - 1, Math.floor((x + r) / cw));
    var y0 = Math.max(0, Math.floor((y - r) / ch)), y1 = Math.min(gridY - 1, Math.floor((y + r) / ch));
    for (var gy = y0; gy <= y1; gy++) {
      for (var gx = x0; gx <= x1; gx++) {
        var i = gy * GRID_X + gx;
        if (grid[i]) continue;
        var dx = (gx + 0.5) * cw - x, dy = (gy + 0.5) * ch - y;
        if (dx * dx + dy * dy <= r2) { grid[i] = 1; clearedCells++; }
      }
    }
  }

  function addStamp(x, y) {
    stamps.push({ x: x / W, y: y / H });
    stamp(x, y);
    markGrid(x, y);
    if (state === "fog" && clearedCells / grid.length >= threshold) dissolve();
  }

  function strokeTo(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y;
    var steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (radius * 0.3)));
    for (var i = 1; i <= steps; i++) addStamp(a.x + dx * i / steps, a.y + dy * i / steps);
  }

  // ---- Pointer input --------------------------------------------------------

  var last = null;

  function pos(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener("pointerdown", function (e) {
    if (state !== "fog") return;
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* older Safari */ }
    hero.classList.add("is-clearing");
    last = pos(e);
    addStamp(last.x, last.y);
  });

  canvas.addEventListener("pointermove", function (e) {
    if (!last || state !== "fog") return;
    var events = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    if (!events.length) events = [e];
    events.forEach(function (ev) {
      var p = pos(ev);
      strokeTo(last, p);
      last = p;
    });
  });

  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (type) {
    canvas.addEventListener(type, function () { last = null; });
  });

  // ---- "Clear it for me": a quick serpentine sweep, then dissolve -----------

  autoBtn.addEventListener("click", function () {
    if (state !== "fog") return;
    hero.classList.add("is-clearing");
    // Keyboard users: keep focus somewhere sensible once the button disappears.
    if (document.activeElement === autoBtn) quote.focus({ preventScroll: true });
    if (reduceMotion.matches) { dissolve(); return; }

    var rows = 4, duration = 1100, start = null;
    var prev = { x: W * 0.08, y: H * 0.15 };
    function frame(t) {
      if (state !== "fog") return;
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / duration);
      var rowF = k * rows, row = Math.min(rows - 1, Math.floor(rowF)), along = rowF - row;
      if (row % 2) along = 1 - along;
      var p = { x: W * (0.08 + 0.84 * along), y: H * (0.15 + 0.7 * (row + (rowF - row)) / rows) };
      strokeTo(prev, p);
      prev = p;
      if (k < 1) requestAnimationFrame(frame);
      else dissolve();
    }
    requestAnimationFrame(frame);
  });

  // ---- State changes ---------------------------------------------------------

  var actionsTimer = null;

  function setState(s) {
    state = s;
    hero.setAttribute("data-state", s);
  }

  function dissolve() {
    if (state !== "fog") return;
    setState("dissolving");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      canvas.removeEventListener("transitionend", finish);
      showQuote();
    }
    canvas.addEventListener("transitionend", finish);
    setTimeout(finish, reduceMotion.matches ? 0 : 1400); // in case transitionend never fires
  }

  function showQuote() {
    setState("clear");
    handlers.cleared.forEach(function (fn) { fn(); });
    actionsTimer = setTimeout(function () { setState("actions"); }, buttonsDelay);
  }

  function dismiss() {
    clearTimeout(actionsTimer);
    hero.classList.add("is-clearing");
    if (state === "fog" || state === "dissolving") handlers.cleared.forEach(function (fn) { fn(); });
    setState("actions");
  }

  function reset() {
    clearTimeout(actionsTimer);
    stamps = [];
    last = null;
    hero.classList.remove("is-clearing");
    setState("fog");
    setup();
  }

  // ---- Buttons ----------------------------------------------------------------

  walkBtn.addEventListener("click", function (e) {
    if (handlers.walk.length) {
      e.preventDefault();
      handlers.walk.forEach(function (fn) { fn(e); });
    } else if (walkBtn.getAttribute("href") === "#walk") {
      // No world wired up yet: behave like "Skip the walk".
      e.preventDefault();
      skipBtn.click();
    }
  });

  skipBtn.addEventListener("click", function (e) {
    handlers.skip.forEach(function (fn) { fn(e); });
  });

  // ---- Start ------------------------------------------------------------------

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    if (state !== "fog") return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  });

  setState("fog");
  setup();

  window.Hero = {
    onWalk: function (fn) { handlers.walk.push(fn); },
    onSkip: function (fn) { handlers.skip.push(fn); },
    onCleared: function (fn) { handlers.cleared.push(fn); },
    dismiss: dismiss,
    reset: reset,
    img: img,
    get state() { return state; }
  };
})();
