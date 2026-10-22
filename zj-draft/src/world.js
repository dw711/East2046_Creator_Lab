/* MANI walk overlay (Jack's file — first draft by ZJ's assistant, please review).
   Listens: 'irph:fogcleared' (preload), 'irph:walk', 'irph:skip' (from hero.js)
   Fires:   'irph:returned'  when the visitor arrives at the real-people section.
   Cases handled:
     - clean embed: iframe loads AppData.worldUrl; the in-world portal opens OUR_URL/#returned
       inside the iframe, and that copy of the page posts 'irph:returned' to the parent.
     - not embeddable: after 10 s we offer "Open the walk in a new tab"; when the visitor
       comes back to this tab (visibilitychange) we play the real-people moment.
     - always: "Step through the portal" and "Skip the walk" work. Esc skips. */
(function () {
  var D = window.AppData, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };
  var walk = $('walk'), frame = $('worldFrame'), cover = $('walkCover'), entering = $('entering');
  var newTab = $('newTab'), hint = $('walkHint');
  var MIN_ENTER = 2000, TIMEOUT = 10000;
  var loaded = false, started = false, t0 = 0, open = false, newTabMode = false, timers = [];

  /* Inside the iframe (or any child window) with #returned: tell the parent, stop. */
  if (window.self !== window.top && location.hash === '#returned') {
    try { window.parent.postMessage({ type: 'irph:returned' }, '*'); } catch (e) {}
    document.documentElement.style.visibility = 'hidden';
    return;
  }

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function preload() {
    if (started || !D.worldUrl) return;
    started = true; t0 = performance.now();
    frame.addEventListener('load', function () { loaded = true; reveal(); });
    frame.src = D.worldUrl;
    newTab.href = D.worldUrl;
  }

  function reveal() {
    if (!open || !loaded) return;
    var wait = Math.max(0, MIN_ENTER - (performance.now() - openedAt));
    later(function () {
      cover.classList.add('gone');
      hint.classList.remove('off');
      frame.focus();
      later(function () { hint.classList.add('off'); }, 7000);
    }, wait);
  }

  var openedAt = 0;
  function openWalk() {
    if (open) return;
    open = true; openedAt = performance.now();
    walk.hidden = false; document.body.classList.add('in-walk');
    requestAnimationFrame(function () { requestAnimationFrame(function () { walk.classList.add('open'); }); });
    cover.classList.remove('gone'); hint.classList.add('off');
    if (!D.worldUrl) {
      entering.textContent = 'The 3D walk isn’t connected yet.';
      return;
    }
    entering.textContent = 'Entering…';
    preload(); reveal();
    later(function () { if (!loaded) newTab.hidden = false; }, TIMEOUT);
    newTab.onclick = function () { newTabMode = true; };
  }

  function closeWalk() {
    clearTimers(); open = false;
    walk.classList.remove('open');
    setTimeout(function () { walk.hidden = true; document.body.classList.remove('in-walk'); }, reduce ? 0 : 600);
  }

  function arrive() {
    closeWalk(); newTabMode = false;
    document.dispatchEvent(new CustomEvent('irph:returned'));
    var real = $('real');
    if (real) real.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  document.addEventListener('irph:fogcleared', preload);
  document.addEventListener('irph:walk', openWalk);
  document.addEventListener('irph:skip', arrive);
  $('portalBtn').addEventListener('click', arrive);
  $('skipWalk').addEventListener('click', arrive);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) arrive(); });
  addEventListener('message', function (e) { if (e.data && e.data.type === 'irph:returned') arrive(); });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && newTabMode) arrive();
  });

  /* Arriving with #returned in a top-level tab (portal opened our link in a new tab). */
  if (location.hash === '#returned') {
    document.dispatchEvent(new CustomEvent('irph:fogcleared'));
    setTimeout(arrive, 50);
  }
})();
