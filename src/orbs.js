/*
 * orbs.js — the "connection field" in #evidence. Owner: ZJ. Original code, no libraries.
 *
 * One glossy orb per country represented (AppData.orbs.count). Orbs close together are
 * joined by thin lines. The cursor (or a finger) pushes them apart and breaks the links;
 * a spring pulls them home so the links re-form. Orbs can be grabbed and thrown, and a
 * click on empty space sends out a ripple. Depth (z) drives size, shading, draw order and
 * a little parallax, so the field reads as 3D.
 *
 * Reduced motion: drawn once, standing still. Off-screen: the loop pauses.
 */
(function () {
  "use strict";

  var canvas = document.querySelector(".orbs__canvas");
  var ctx = canvas && canvas.getContext && canvas.getContext("2d");
  if (!ctx) return;

  var data = (window.AppData && window.AppData.orbs) || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = window.matchMedia("(max-width: 640px)").matches;
  var COUNT = Math.round((data.count || 50) * (small ? 0.7 : 1));
  // Brand colours: [base, highlight]
  var COLOURS = [
    ["#C9DD6E", "#F1F8C8"],   // lime
    ["#A66B50", "#E2B49C"],   // terracotta
    ["#163D32", "#4E8A74"],   // deep green
    ["#E9E2CF", "#FFFFFF"]    // cream
  ];

  var W = 0, H = 0, dpr = 1, unit = 1;
  var orbs = [];
  var pointer = { x: -9999, y: -9999, px: 0, py: 0, inside: false };
  var grabbed = null, grabOffX = 0, grabOffY = 0;
  var ripples = [];
  var running = false, visible = false, last = 0;

  function rand(seed) {
    return function () {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  function build() {
    var r = rand(1729);
    orbs = [];
    for (var i = 0; i < COUNT; i++) {
      var z = r();
      orbs.push({
        i: i,
        hx: 0, hy: 0,                    // home, set in layout()
        x: 0, y: 0, vx: 0, vy: 0,
        z: z,                            // 0 = far, 1 = near
        size: 0.55 + r() * 0.45,
        colour: COLOURS[Math.floor(r() * COLOURS.length)],
        phase: r() * Math.PI * 2
      });
    }
    orbs.sort(function (a, b) { return a.z - b.z; }); // far ones drawn first
  }

  function layout() {
    var rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    unit = Math.min(W, H) / 600;

    // Golden-angle spiral: a loose, even cluster, stretched to the box.
    var cx = W / 2, cy = H / 2, rx = W * 0.42, ry = H * 0.4, golden = 2.39996323;
    orbs.forEach(function (o) {
      var t = Math.sqrt((o.i + 0.5) / COUNT);
      var a = o.i * golden;
      var first = o.hx === 0 && o.hy === 0;
      o.hx = cx + Math.cos(a) * t * rx;
      o.hy = cy + Math.sin(a) * t * ry;
      if (first) { o.x = o.hx; o.y = o.hy; }
    });
  }

  function radius(o) { return (14 + 30 * o.z) * o.size * unit + 4; }

  // ---- Physics -----------------------------------------------------------------

  function step(dt, t) {
    var pushR = 190 * unit + 50, pushR2 = pushR * pushR;

    orbs.forEach(function (o) {
      if (o === grabbed) return;
      // Spring home, with a slow idle drift so the field breathes.
      var hx = o.hx + Math.cos(t * 0.0006 + o.phase) * 10 * unit;
      var hy = o.hy + Math.sin(t * 0.0008 + o.phase) * 12 * unit;
      o.vx += (hx - o.x) * 0.012 * dt;
      o.vy += (hy - o.y) * 0.012 * dt;

      // Pointer pushes nearby orbs away (near ones feel it more).
      if (pointer.inside) {
        var dx = o.x - pointer.x, dy = o.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < pushR2 && d2 > 0.01) {
          var d = Math.sqrt(d2), f = (1 - d / pushR) * (1.4 + o.z) * dt;
          o.vx += dx / d * f * 6;
          o.vy += dy / d * f * 6;
        }
      }
    });

    // Ripples: an expanding ring that shoves orbs outward as it passes.
    ripples.forEach(function (rp) {
      rp.r += 9 * dt;
      orbs.forEach(function (o) {
        var dx = o.x - rp.x, dy = o.y - rp.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var band = Math.abs(d - rp.r);
        if (band < 40) {
          var f = (1 - band / 40) * rp.power * dt;
          o.vx += dx / d * f;
          o.vy += dy / d * f;
        }
      });
      rp.power *= Math.pow(0.95, dt);
    });
    ripples = ripples.filter(function (rp) { return rp.power > 0.05 && rp.r < Math.max(W, H); });

    // Orbs don't overlap (cheap pairwise separation; 50 orbs is ~1,200 pairs).
    for (var a = 0; a < orbs.length; a++) {
      for (var b = a + 1; b < orbs.length; b++) {
        var p = orbs[a], q = orbs[b];
        var dx = q.x - p.x, dy = q.y - p.y, min = radius(p) + radius(q) + 2;
        var d2 = dx * dx + dy * dy;
        if (d2 < min * min && d2 > 0.0001) {
          var d = Math.sqrt(d2), push = (min - d) * 0.5, nx = dx / d, ny = dy / d;
          if (p !== grabbed) { p.x -= nx * push; p.y -= ny * push; }
          if (q !== grabbed) { q.x += nx * push; q.y += ny * push; }
        }
      }
    }

    var damp = Math.pow(0.9, dt);
    orbs.forEach(function (o) {
      if (o === grabbed) return;
      o.vx *= damp; o.vy *= damp;
      o.x += o.vx * dt; o.y += o.vy * dt;
      var r = radius(o);
      if (o.x < r) { o.x = r; o.vx *= -0.6; }
      if (o.x > W - r) { o.x = W - r; o.vx *= -0.6; }
      if (o.y < r) { o.y = r; o.vy *= -0.6; }
      if (o.y > H - r) { o.y = H - r; o.vy *= -0.6; }
    });
  }

  // ---- Drawing -------------------------------------------------------------------

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Parallax: near orbs shift a little against the pointer.
    var ox = pointer.inside ? (pointer.x / W - 0.5) : 0;
    var oy = pointer.inside ? (pointer.y / H - 0.5) : 0;
    function sx(o) { return o.x - ox * 18 * (o.z - 0.5); }
    function sy(o) { return o.y - oy * 18 * (o.z - 0.5); }

    // Links between neighbours. Their strength fades with distance.
    var linkD = 120 * unit + 30;
    ctx.lineWidth = 1;
    for (var a = 0; a < orbs.length; a++) {
      for (var b = a + 1; b < orbs.length; b++) {
        var p = orbs[a], q = orbs[b];
        var dx = q.x - p.x, dy = q.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d > linkD) continue;
        var alpha = (1 - d / linkD) * 0.35 * (0.4 + (p.z + q.z) / 2);
        ctx.strokeStyle = "rgba(22, 61, 50," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(sx(p), sy(p));
        ctx.lineTo(sx(q), sy(q));
        ctx.stroke();
      }
    }

    orbs.forEach(function (o) {
      var r = radius(o), x = sx(o), y = sy(o);
      var fade = 0.55 + o.z * 0.45;

      // Soft contact shadow below
      ctx.globalAlpha = 0.12 * fade;
      ctx.fillStyle = "#163D32";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.15, y + r * 1.05, r * 0.8, r * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body: lit from the upper left
      ctx.globalAlpha = fade;
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      g.addColorStop(0, o.colour[1]);
      g.addColorStop(0.55, o.colour[0]);
      g.addColorStop(1, shade(o.colour[0], -0.35));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Specular glint
      ctx.globalAlpha = 0.55 * fade;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(x - r * 0.38, y - r * 0.45, r * 0.22, r * 0.13, -0.6, 0, Math.PI * 2);
      ctx.fill();

      if (o === grabbed) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#A66B50";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
    });
    ctx.globalAlpha = 1;

    ripples.forEach(function (rp) {
      ctx.strokeStyle = "rgba(166, 107, 80," + Math.min(0.5, rp.power * 0.06).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    var f = function (c) { return Math.max(0, Math.min(255, Math.round(c * (1 + amt)))); };
    return "rgb(" + f(r) + "," + f(g) + "," + f(b) + ")";
  }

  // ---- Loop ----------------------------------------------------------------------

  function loop(t) {
    if (!running) return;
    var dt = last ? Math.min(3, (t - last) / 16.67) : 1;
    last = t;
    step(dt, t);
    draw();
    requestAnimationFrame(loop);
  }

  function start() {
    if (running || reduce) return;
    running = true;
    last = 0;
    requestAnimationFrame(loop);
  }

  function stop() { running = false; }

  // ---- Input ---------------------------------------------------------------------

  function local(e) {
    var r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function hit(p) {
    for (var i = orbs.length - 1; i >= 0; i--) { // nearest first
      var o = orbs[i], r = radius(o) + 6;
      if ((o.x - p.x) * (o.x - p.x) + (o.y - p.y) * (o.y - p.y) < r * r) return o;
    }
    return null;
  }

  canvas.addEventListener("pointermove", function (e) {
    var p = local(e);
    pointer.px = pointer.x; pointer.py = pointer.y;
    pointer.x = p.x; pointer.y = p.y; pointer.inside = true;
    if (grabbed) {
      var nx = p.x - grabOffX, ny = p.y - grabOffY;
      grabbed.vx = nx - grabbed.x; grabbed.vy = ny - grabbed.y;
      grabbed.x = nx; grabbed.y = ny;
    }
    canvas.setAttribute("data-cursor", grabbed ? "Throw" : hit(p) ? "Grab" : "Push");
  });

  canvas.addEventListener("pointerleave", function () {
    if (!grabbed) pointer.inside = false;
  });

  canvas.addEventListener("pointerdown", function (e) {
    var p = local(e), o = hit(p);
    if (o) {
      grabbed = o;
      grabOffX = p.x - o.x; grabOffY = p.y - o.y;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* older Safari */ }
      if (e.pointerType !== "mouse") e.preventDefault();
    } else {
      ripples.push({ x: p.x, y: p.y, r: 0, power: 8 });
    }
    start();
  });

  ["pointerup", "pointercancel"].forEach(function (type) {
    canvas.addEventListener(type, function (e) {
      if (!grabbed) return;
      grabbed.vx *= 1.4; grabbed.vy *= 1.4; // a little extra fling
      grabbed = null;
      if (e.pointerType !== "mouse") pointer.inside = false;
    });
  });

  // ---- Start -----------------------------------------------------------------------

  build();
  layout();
  draw();

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { layout(); draw(); }, 150);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }).observe(canvas);
  } else {
    start();
  }
})();
