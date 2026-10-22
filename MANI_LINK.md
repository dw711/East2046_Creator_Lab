# How the page links into MANI and back out

The 3D walk is a MANI Engine world embedded in our page. This note explains how a visitor gets
into it, how they get back out, and what to change if the world moves.

- **Our page:** `index.html` (built into `dist/index.html` by `build.py`)
- **The world:** https://maniengine.com/t/TjLS1dHz0fVh (MANI project "My Scene")

```
 #hero (fog)  ──enter──▶  #walk (MANI iframe)  ──"irph:returned"──▶  #real (real people)
      │                                                                   ▲
      └──────────────────────────── Skip the walk ────────────────────────┘
```

---

## 1. Getting in

### The world is always on the page
`#walk` contains a plain `<iframe id="world" src="https://maniengine.com/t/TjLS1dHz0fVh">`
with `loading="eager"`. It is not created on demand, so the world starts loading as soon as the
page opens and is usually ready by the time the visitor has cleared the fog.

MANI sends no `X-Frame-Options` or `frame-ancestors` header, so the world can be embedded. The
iframe stays at `opacity: 0` until its first `load` event, then gets `.loaded`, so nobody ever
sees a blank frame.

### Three ways to arrive at the walk
1. **Automatically after the fog.** When the fog is cleared, the hero script fires `fog:cleared`.
   The page shows the quote, then 2.4 s later a "Next: Walking out of the dark spot" row with a
   countdown, and at 8 s calls `enterWorld()` (`ENTER_AFTER` and `CUE_AT` in the walk script).
2. **"Enter now".** The button in that row calls `enterWorld()` straight away.
3. **Scrolling down.** `#walk` is 200vh tall with a sticky stage. As it scrolls in, the framed
   window grows to full screen (CSS variable `--p`, 0 → 1) and the info sheet ("Keep scrolling to
   step in") fades out.

If the visitor scrolls more than half a screen on their own, or clicks "Skip the walk", the
automatic entry is cancelled so the page never pulls them back.

### The hand-off (`enterWorld()`)
To make the jump from the hero to the world look like one continuous shot:
1. The hero gets `.entering`: the quote and cue fade and the spawn image zooms forward (1.1 s).
2. `#enter-veil`, a fixed full-screen copy of the same spawn image (`assets/opening.jpg`), covers
   the screen.
3. The page jumps to `#walk` instantly behind the veil.
4. The veil fades out to reveal the live world. If the world hasn't loaded yet, the page waits for
   its `load` event, or 10 s at most so slow Wi-Fi never leaves the veil stuck.

`assets/opening.jpg` is a screenshot of the world's spawn view (`opening.png`, cropped to remove
the MANI HUD), so the image under the fog and the first frame of the live world match.

### Walking
Once the window fills the screen and `#walk` still covers the viewport, the section gets
`.immersed`:
- the iframe starts receiving pointer events (before that, scrolling passes over it), and
- keyboard focus moves into the iframe, so WASD and the arrow keys walk instead of scrolling.

Scrolling away removes `.immersed` and takes focus back from the world.

---

## 2. Getting out

### What the world does
The world's script (in the MANI project's `scene.html`) has one exit function, `enterPortal()`.
It runs when the visitor:
- walks into the main portal at the end of the path (within 1.25 m of `x 0, z -76`),
- walks into the small "Skip ahead" ring next to the spawn point, or
- clicks the world's own "Skip the walk →" button (top right).

`enterPortal()` checks whether the world is inside a frame:

```js
if (window.parent !== window) {
  window.parent.postMessage({ type: 'irph:returned' }, '*');   // embedded: tell our page
} else {
  window.location.assign(destination);                        // opened on its own
}
```

### What our page does
Our page listens for that message:

```js
window.addEventListener('message', e => {
  const fromWorld = e.source === world.contentWindow || e.source === window;
  const type = e.data && (e.data.type || e.data);
  if (fromWorld && type === 'irph:returned') returnToSite();
});
```

The message is trusted by its **source window** (our iframe), not its origin. MANI serves worlds in
a CSP sandbox, so their origin is the opaque `"null"` and an origin check would always fail.

`returnToSite()` then:
1. turns the veil on in its solid dark version (`.solid`, matching `#real`),
2. jumps to `#real` ("Portal → real people") behind it and fades the veil away, and
3. reloads the iframe (`world.src = world.src`), so the walk starts fresh if the visitor scrolls back
   up.

### Backups
- **The world navigates away.** Any iframe `load` after the first one is treated as the walk ending
  and calls `returnToSite()`. This catches an older version of the world that follows a link
  instead of posting the message.
- **`#returned` links.** If a portal ever opens `OUR_URL/#returned` inside the iframe, that copy of
  our page removes its own iframe (so the world doesn't load inside itself) and posts
  `irph:returned` to the parent. Opened in a normal tab, `#returned` just scrolls to `#real`.
- **Skipping on our side.** The "Skip the walk ↓" link under the hero and the "Skip the walk"
  button in the bottom-right corner during the walk are plain `href="#real"` links. They work
  without the world and without JavaScript.

---

## 3. Changing things

| To change | Edit |
|---|---|
| The world being embedded | the `src` of `<iframe id="world">` in `index.html`, then run `python3 build.py` |
| The spawn image under the fog | replace `assets/opening.jpg` with a new screenshot of the spawn view (crop out the HUD) |
| How long before the page enters the world | `ENTER_AFTER` and `CUE_AT` in the walk script |
| What happens at the end of the walk | `returnToSite()` in the walk script |
| Where the world goes when opened on its own | `destination` and the `#skip` link `href` in the MANI project's `scene.html` (both still `https://todo.duowang.dev`) |

**If you rebuild or replace the world in MANI**, it must keep the exit contract:
`window.parent.postMessage({ type: 'irph:returned' }, '*')` when the walk ends while it is
embedded. Without that, visitors only get back by the navigation backup above or by our own
"Skip the walk" button.

`build.py` also writes `dist/mani-scene.html`, a copy of the page for hosting inside MANI itself.
MANI's sandbox blocks popups, so that copy opens external links in the same tab.

## 4. Testing
1. Open `dist/index.html` (from disk is fine) and clear the fog. After about 8 s you should be in the
   world, with WASD working without clicking first.
2. Walk into the "Skip ahead" ring next to the spawn point. The screen should fade to dark and land
   on "Portal → real people".
3. Scroll back up into the walk. The world should be back at the spawn point.
4. Reload, clear the fog, and click "Skip the walk ↓". You should land on `#real` and not be
   pulled into the world.
