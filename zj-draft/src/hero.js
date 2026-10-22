/* Fog hero (ZJ). Drag to wipe the fog; at 45% cleared it dissolves.
   Hooks for world.js (events on document):
     'irph:fogcleared'  fired once when the fog is gone
     'irph:walk'        visitor chose "Walk out of the dark spot"
     'irph:skip'        visitor chose "Skip the walk"
   Listens for 'irph:returned' to finish the fog instantly. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('fog');
  var ctx = canvas.getContext('2d', { willReadFrequently: true });
  var quote = document.getElementById('heroQuote');
  var actions = document.getElementById('heroActions');
  var prompt = document.getElementById('heroPrompt');
  var pct = document.getElementById('pct');
  var THRESHOLD = 0.45;
  var done = false, drawing = false, last = null, lastCheck = 0, w = 0, h = 0, dpr = 1;
  var probe = document.createElement('canvas'); probe.width = 48; probe.height = 27;
  var pctx = probe.getContext('2d', { willReadFrequently: true });

  function rand(a, b) { return a + Math.random() * (b - a); }

  function paintFog() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(138,146,142,0.97)';
    ctx.fillRect(0, 0, w, h);
    var n = Math.round((w * h) / 22000);
    for (var i = 0; i < n; i++) {
      var x = rand(0, w), y = rand(0, h), r = rand(60, 220) * dpr;
      var light = Math.random() > 0.5;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, light ? 'rgba(214,220,216,0.35)' : 'rgba(96,104,100,0.35)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }

  function resize() {
    if (done) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    /* Ignore small height changes (mobile address bar) so progress isn't wiped. */
    if (w && Math.round(canvas.clientWidth * dpr) === w && Math.abs(canvas.clientHeight * dpr - h) < 160 * dpr) return;
    w = canvas.width = Math.round(canvas.clientWidth * dpr);
    h = canvas.height = Math.round(canvas.clientHeight * dpr);
    paintFog();
  }

  function brush() { return Math.max(70, Math.min(canvas.clientWidth, canvas.clientHeight) * 0.11) * dpr; }

  function wipe(x, y) {
    var r = brush();
    ctx.globalCompositeOperation = 'destination-out';
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.6, 'rgba(0,0,0,0.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
  }

  function stroke(x, y) {
    if (last) {
      var dx = x - last.x, dy = y - last.y, d = Math.hypot(dx, dy), step = brush() * 0.3;
      for (var t = step; t < d; t += step) wipe(last.x + (dx * t) / d, last.y + (dy * t) / d);
    }
    wipe(x, y);
    last = { x: x, y: y };
  }

  function cleared() {
    pctx.clearRect(0, 0, 48, 27);
    pctx.drawImage(canvas, 0, 0, 48, 27);
    var d = pctx.getImageData(0, 0, 48, 27).data, c = 0;
    for (var i = 3; i < d.length; i += 4) if (d[i] < 70) c++;
    return c / (48 * 27);
  }

  function pos(e) {
    var r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * dpr, y: (e.clientY - r.top) * dpr };
  }

  function check(force) {
    var now = performance.now();
    if (!force && now - lastCheck < 140) return;
    lastCheck = now;
    var c = cleared();
    pct.textContent = Math.min(100, Math.round((c / THRESHOLD) * 100)) + '% cleared';
    if (c >= THRESHOLD) dissolve();
  }

  function dissolve(instant) {
    if (done) return;
    done = true; drawing = false;
    canvas.classList.add('gone');
    prompt.classList.add('done');
    document.dispatchEvent(new CustomEvent('irph:fogcleared'));
    var d1 = reduce || instant ? 0 : 700, d2 = reduce || instant ? 0 : 3000;
    setTimeout(function () { quote.classList.add('show'); }, d1);
    setTimeout(function () { actions.classList.add('show'); }, d1 + d2);
  }

  canvas.addEventListener('pointerdown', function (e) {
    if (done) return;
    drawing = true; last = null;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
    var p = pos(e); stroke(p.x, p.y); check();
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drawing || done) return;
    var p = pos(e); stroke(p.x, p.y); check();
  });
  function up() { if (drawing) { drawing = false; last = null; if (!done) check(true); } }
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  document.getElementById('clearBtn').addEventListener('click', function () { dissolve(); });
  document.getElementById('walkBtn').addEventListener('click', function () { document.dispatchEvent(new CustomEvent('irph:walk')); });
  document.getElementById('skipBtn').addEventListener('click', function () { document.dispatchEvent(new CustomEvent('irph:skip')); });
  document.addEventListener('irph:returned', function () {
    if (!done) { done = true; canvas.classList.add('gone'); prompt.classList.add('done'); quote.classList.add('show'); actions.classList.add('show'); }
  });

  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
  resize();
})();
