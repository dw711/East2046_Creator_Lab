/* Page behaviour (ZJ): render from AppData, Emotion-style UX (kinetic type,
   cursor, magnetic buttons, section counter), counters, story, ask. */
(function () {
  var D = window.AppData;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---- 1. Render text from AppData (data-bind="a.b") ---- */
  $$('[data-bind]').forEach(function (n) {
    var v = n.getAttribute('data-bind').split('.').reduce(function (o, k) { return o && o[k]; }, D);
    if (typeof v === 'string') n.textContent = v;
  });
  $('#navDonate').href = D.donateUrl; $('#donate').href = D.donateUrl;

  /* ---- 2. Kinetic word reveal (masked slide-up, staggered) ---- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.25 }) : null;
  function split(n) {
    var words = n.textContent.trim().split(/\s+/);
    n.setAttribute('aria-label', words.join(' '));
    n.textContent = '';
    words.forEach(function (word, i) {
      var w = el('span', 'w'); w.setAttribute('aria-hidden', 'true');
      var s = el('span', null, word); s.style.setProperty('--i', i);
      w.appendChild(s); n.appendChild(w);
      if (i < words.length - 1) n.appendChild(document.createTextNode(' '));
    });
  }
  function watch(n) { if (io) io.observe(n); else n.classList.add('in'); }
  $$('.kinetic').forEach(function (n) { split(n); watch(n); });
  $$('.reveal').forEach(watch);

  /* ---- 3. Real-people moment ---- */
  var photo = D.real.photo, img = $('#realImg');
  img.alt = photo.alt; $('#realCredit').textContent = photo.credit;
  img.onload = function () { img.classList.add('ok'); };
  img.src = photo.src;
  var realPhoto = $('#realPhoto');
  if (io) new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) realPhoto.classList.add('seen'); });
  }, { threshold: 0.35 }).observe(realPhoto);
  else realPhoto.classList.add('seen');
  document.addEventListener('irph:returned', function () {
    realPhoto.classList.remove('play', 'seen'); void realPhoto.offsetWidth; realPhoto.classList.add('play');
  });

  /* ---- 4. How change happens: tap-through + "What matters to you?" ---- */
  var steps = D.change.steps, cur = 0;
  var tabs = $('#tabs'), panels = $('#panels'), rootPath = $('#rootPath'), leaves = $('#leaves');
  rootPath.setAttribute('pathLength', '1');
  steps.forEach(function (s, i) {
    var t = el('button', 'tab', s.n + ' ' + s.title);
    t.type = 'button'; t.setAttribute('role', 'tab'); t.id = 'tab' + i; t.setAttribute('aria-controls', 'panel' + i);
    t.addEventListener('click', function () { go(i); });
    tabs.appendChild(t);
    var p = el('div', 'panel'); p.id = 'panel' + i; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', 'tab' + i);
    p.appendChild(el('div', 'n', s.n)); p.appendChild(el('h3', null, s.title)); p.appendChild(el('p', null, s.text));
    if (i === 0) {
      var L = D.change.listen, f = el('form', 'listen'); f.setAttribute('autocomplete', 'off');
      var lab = el('label', null, L.label); lab.htmlFor = 'wordIn';
      var inp = el('input'); inp.id = 'wordIn'; inp.maxLength = 24; inp.placeholder = L.placeholder; inp.setAttribute('data-cursor', 'Type');
      var b = el('button', 'btn mag', L.button); b.type = 'submit';
      f.appendChild(lab); f.appendChild(inp); f.appendChild(b); f.appendChild(el('small', null, L.note));
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var w = inp.value.trim().slice(0, 24); if (!w) return;
        var li = el('li', null, w); /* textContent only: no HTML injection */
        leaves.appendChild(li); if (leaves.children.length > 12) leaves.removeChild(leaves.firstChild);
        inp.value = ''; inp.focus();
      });
      p.appendChild(f);
    }
    panels.appendChild(p);
  });
  function go(i) {
    cur = clamp(i, 0, steps.length - 1);
    $$('.tab', tabs).forEach(function (t, k) { t.setAttribute('aria-selected', k === cur); t.tabIndex = k === cur ? 0 : -1; });
    $$('.panel', panels).forEach(function (p, k) { p.classList.toggle('on', k === cur); });
    rootPath.style.strokeDashoffset = String(1 - (cur + 1) / steps.length);
    $('#prevStep').disabled = cur === 0; $('#nextStep').disabled = cur === steps.length - 1;
    $('#prevStep').style.opacity = cur === 0 ? .4 : 1; $('#nextStep').style.opacity = cur === steps.length - 1 ? .4 : 1;
  }
  $('#prevStep').addEventListener('click', function () { go(cur - 1); });
  $('#nextStep').addEventListener('click', function () { go(cur + 1); });
  tabs.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { go(cur + 1); $('#tab' + cur).focus(); }
    if (e.key === 'ArrowLeft') { go(cur - 1); $('#tab' + cur).focus(); }
  });
  go(0);

  /* ---- 5. Evidence counters (final values rendered first) ---- */
  var stats = $('#stats'), counters = [];
  D.evidence.stats.forEach(function (s) {
    var d = el('div', 'stat'), v = el('span', 'v', s.value.toLocaleString('en-GB') + s.suffix);
    d.appendChild(v); d.appendChild(el('span', 'l', s.label)); stats.appendChild(d);
    counters.push({ node: v, s: s });
  });
  function count(c) {
    if (reduce) return;
    var t0 = performance.now(), dur = 1700;
    (function tick(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      c.node.textContent = Math.round(c.s.value * e).toLocaleString('en-GB') + (k === 1 ? c.s.suffix : '');
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  if (io) new IntersectionObserver(function (es, ob) {
    es.forEach(function (e) { if (e.isIntersecting) { counters.forEach(count); ob.disconnect(); } });
  }, { threshold: 0.4 }).observe(stats);

  /* ---- 6. Programmes + 7. Ask ---- */
  D.programmes.items.forEach(function (p) { $('#plist').appendChild(el('li', null, p.name)); });
  var msg = $('#askMsg'), chips = $('#chips');
  msg.textContent = D.ask.hint;
  D.programmes.items.forEach(function (p) {
    var c = el('button', 'chip mag', p.name); c.type = 'button'; c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', function () {
      $$('.chip', chips).forEach(function (o) { o.setAttribute('aria-pressed', o === c); });
      msg.textContent = p.ask;
    });
    chips.appendChild(c);
  });

  /* ---- Footer + sources panel ---- */
  D.footer.credits.forEach(function (c) { $('#credits').appendChild(el('li', null, c)); });
  var tb = $('#factTable'), head = el('tr');
  ['Claim', 'Wording on page', 'Source', 'Page', 'Checked by'].forEach(function (h) { head.appendChild(el('th', null, h)); });
  tb.appendChild(head);
  D.facts.forEach(function (f) {
    var r = el('tr'); [f.claim, f.page, f.source, f.pp, f.by].forEach(function (c) { r.appendChild(el('td', null, c)); }); tb.appendChild(r);
  });
  D.aiUse.forEach(function (t) { $('#aiUse').appendChild(el('li', null, t)); });

  /* ---- Nav: progress bar + section counter ---- */
  var secs = ['hero', 'real', 'change', 'evidence', 'programmes', 'ask'].map(function (id) { return document.getElementById(id); });
  var bar = $('#bar'), counter = $('#counter'), ticking = false;
  function onScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? clamp(scrollY / max, 0, 1) : 0) + ')';
    var idx = 0;
    secs.forEach(function (s, i) { if (s.getBoundingClientRect().top < innerHeight * 0.5) idx = i; });
    counter.textContent = '0' + (idx + 1) + ' / 0' + secs.length;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---- Cursor ring + magnetic buttons (fine pointers, no reduced motion) ---- */
  if (matchMedia('(pointer:fine)').matches && !reduce) {
    var cur2 = $('#cursor'), lab2 = $('span', cur2), tx = -100, ty = -100, x = -100, y = -100;
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var t = e.target.closest ? e.target.closest('[data-cursor],a,button,input,summary') : null;
      var label = t && t.getAttribute('data-cursor');
      cur2.classList.toggle('hot', !!t && !label);
      cur2.classList.toggle('label', !!label);
      lab2.textContent = label || '';
      var m = e.target.closest ? e.target.closest('.mag') : null;
      $$('.mag').forEach(function (b) { if (b !== m) b.style.transform = ''; });
      if (m) {
        var r = m.getBoundingClientRect();
        m.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + 'px)';
      }
    }, { passive: true });
    (function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      cur2.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
  }
})();
