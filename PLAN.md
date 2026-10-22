# "Clear the Dark" — IRPH Interactive Web Page Plan (v3)

**Event:** CapCut × EAST2046 — University of Cambridge Film and Interactive Web Lab
**Date:** Thursday 22 October 2026, close 6:30 PM BST
**Track:** Track 2 — Interactive Web Page (HTML page, ≥2 interaction types, reusable workflow documenting sources and AI use)
**Partner:** Intercultural Roots for Public Health (IRPH), Registered Charity No. 1179885
**Team:** Jack, ZJ
**Judging:** creative output AND workflow are both assessed.

**Audience (from brief):** people discovering IRPH for the first time, especially potential donors.
**Story the page must answer (from brief):** Why do we exist? What do we do? How does change happen?

---

## 1. Status

| Item | Status |
|---|---|
| Fog hook | Agreed — **built (Z1)** |
| MANI walk straight after the hook | Agreed |
| In-world portal opens our link after the walk | **Works** ✅ |
| MANI loading/waiting animation before the world appears | Annoying — Jack trying to remove |
| **Is it a clean embed?** (does the MANI world load inside our page's `<iframe>`?) | **OPEN — Jack testing (task J4)** |
| Portal opens our link in same tab or new tab? | Confirm during J4 |
| Permission to use brief photos | OPEN — Jack asking organisers (task J2) |

### The open question: is it a clean embed?
Test: put the published MANI world URL in a bare `<iframe>` in a test HTML file and open it. (Owner: Jack, task J4)
Faster first check: `curl -sI <MANI_URL> | grep -i -E 'x-frame-options|content-security-policy'`.

- **Clean embed (world loads in the iframe):** world runs in our overlay. The portal loads
  `OUR_URL/#returned` inside the iframe; our page detects it is inside an iframe and tells the
  parent with `parent.postMessage({irph: 'returned'}, '*')` (not direct same-origin access —
  the submitted file may be opened from `file://`, a different origin from Pages).
- **Not a clean embed (blank / refused):** "Walk out of the dark spot" opens the world in a
  new tab. The portal opens `OUR_URL/#returned`. Backup: `BroadcastChannel('irph')` from the
  returned tab, then `visibilitychange` — armed only after the walk tab was opened.
- **Either way:** a "Skip the walk" link and our own "Step through the portal" button always work.
- The portal always lands on the **Pages** copy, so deploy the final build to Pages before submitting.

---

## 2. The page, section by section

1. **Fog hero** (Interaction: drag)
   - Under the fog: screenshot of the MANI world's **spawn view** (grey street, path leading
     to a golden garden in the distance).
   - Prompt: "Click and drag to clear the dark spot." At ~45% cleared, fog dissolves.
   - Quote appears on a soft dark band:
     > "EcoGPX® helped me get out of a dark spot I was in. It allowed me to reconnect with
     > myself, with others and with the world around me and nature."
     > — Participant, EcoGPX Coventry Launchpad
   - ~3 s later: button "Walk out of the dark spot →" + small "Skip the walk" link.
   - "Clear it for me" button for keyboard users and impatient judges.

2. **MANI walk** (Interaction: 3D walking)
   - On click: quote fades, image zooms forward ~0.5 s, world fades in over the identical frame.
   - Hint for a few seconds: "Click to start, then use arrow keys or WASD to walk."
   - World starts loading in the background as soon as the fog clears.
   - Show "Entering…" for at least ~2 s; if not ready after ~10 s, offer "Open the walk in a new tab".
   - Our "Step through the portal" ring is visible in a corner throughout.
   - Walk ends at the in-world portal → `OUR_URL/#returned`.
   - Touch devices: if MANI has no touch controls, make "Skip the walk" the primary action.

3. **Portal → real people** (answers *Why do we exist?*)
   - Fades up on the real EcoGPX Coventry group photo (2024).
   - "That garden was imagined. These people are real."
   - Then: "Creativity reconnects us." + "Loneliness, inequality and disconnection affect how
     we live. We bring artists, practitioners and communities together to improve wellbeing,
     strengthen belonging and reconnect people with nature and place."
   - Loading the page with `#returned` skips the fog and starts here.

4. **How change happens** (Interaction: tap-through)
   - 01 Listen — Start with "What Matters to You?"
   - 02 Create Together — Arts, movement, storytelling and cultural exchange.
   - 03 Connect — Community participation and ethical technology, shaped by lived experience.
   - One panel at a time; a root line grows between them as the visitor advances.

5. **Evidence** — "Real people. Real connection." (counters on scroll)
   - 1,729 people engaged with activities, resources and events
   - 789 network members
   - 50+ countries represented
   - Label: 2024–25 impact. Source: IRPH Impact Report 2024–25, pp. 3 and 10.
   - Final values are in the HTML so they show without JS or with reduced motion.

6. **What IRPH does** — Creative health / Arts Disability Network / EcoGPX® / Forum Theatre
   (only wording from the brief or IRPH's site; no invented descriptions).

7. **The ask** (Interaction: selection)
   - "What would you help grow?" Visitor taps a programme; message updates, e.g.
     "Help more people find programmes like EcoGPX®."
   - "Help Intercultural Roots reach more people. Donate. Be part of what grows next."
   - Button → https://interculturalroots.org/make-a-donation
   - Don't claim the donation goes to the chosen programme. No invented £ amounts.
   - Full-viewport green panel, no scroll-jacking.

8. **Footer** — photo credits, sources, "Built with AI assistance — see workflow doc",
   "The 3D garden is an imagined space generated with MANI Engine.", Registered Charity No. 1179885.

### Photo credits (from the brief — use exactly, next to each image)
- Boal Forum Theatre, 2024. Image: Intercultural Roots.
- EcoGPX Coventry, 2024. Image: Intercultural Roots.
- EcoGPX Coventry, 2024. Photo: Kopal Gupta.
- Bridging Cultures, Coventry, 2025. Image: Intercultural Roots.

If photo permission is refused: section 3 becomes typography only, with the same line.
The EcoGPX group photo includes children — ask about this explicitly (J2) and record the answer.

---

## 3. Engineering rules

- **Build** in separate files (to avoid merge conflicts); **submit** one self-contained
  `index.html` produced by `build.py` (inlines CSS, JS, images as base64).
- All copy, stats, credits, URLs in `data.js` → `AppData`, commented for non-coders.
  Text is also present in the HTML (`data-copy="path"` attributes), so the page reads fine
  without JS; `sections.js` (or `build.py` at build time) fills it from `AppData`.
- Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
- All text is real HTML (never baked into canvas or images).
- Palette (sampled from the brief PDF): green `#163D32`, cream `#F5F1E7`, lime `#D4E781`,
  terracotta `#A66B50`, ink `#1A1C1A`.
- Works on a 375 px phone, the demo laptop, by keyboard, and with the MANI walk skipped.

### Repo layout
```
/index.html        shell that loads the files below (dev only)
/src/data.js       AppData — Jack
/src/styles.css    ZJ (Jack adds overlay styles in a marked block at the end)
/src/hero.js       fog canvas — ZJ
/src/world.js      MANI overlay, transition, portal, #returned — Jack
/src/sections.js   story, counters, programmes, ask — ZJ
/assets/           compressed photos + spawn screenshot
/build.py          inlines everything into dist/index.html — Jack
/PLAN.md           this file
/README.md         workflow doc — both
/PROMPT_LOG.md     every AI prompt, by whoever used it — both
```

---

## 4. Tasks, split between Jack and ZJ

Durations are estimates. Do tasks in order within each column. ⚑ = blocks the other person.

### Jack — setup, MANI, integration, testing (~4 h)

| # | Task | Est. | Done when |
|---|---|---|---|
| J1 ⚑ | Create GitHub repo, invite ZJ (`zhanjunyuen`), push skeleton (layout above), turn on GitHub Pages | 15 m | ZJ can clone; Pages URL loads — **skeleton pushed with Z1; invite + Pages still to do** |
| J2 ⚑ | Ask organisers about photo permissions; get the four images; compress (<300 KB each) | 20 m | Images in `/assets` or "no" recorded |
| J3 ⚑ | `data.js` / `AppData`: all copy, quote, stats (value, label, source, page), credits, programmes, donation URL — copied from the brief | 25 m | Every field checked against the PDF (hero block done) |
| J4 | **Clean-embed test** + confirm portal opens same tab or new tab | 10 m | §1 table updated with the answer |
| J5 | MANI finish: point portal at `PAGES_URL/#returned`, set spawn point facing the path, try to remove waiting animation, take spawn screenshot (hand to ZJ for the fog hero) | 40 m | Walk → portal lands on our page; screenshot in `/assets` |
| J6 | Transition + overlay (`world.js`): background preload, zoom-and-fade, "Entering…" min 2 s, 10 s timeout fallback, controls hint, portal ring, "Skip the walk", new-tab path if no clean embed | 40 m | Both embed outcomes tested |
| J7 | `#returned` handling: skip fog, play real-photo moment; iframe-to-parent close; `visibilitychange` backup | 25 m | Portal return works end to end |
| J8 | `build.py` + final single-file check (opens from a USB stick, MANI skipped); deploy the same build to Pages | 20 m | `dist/index.html` works alone |
| J9 | Test pass: phone, demo laptop, keyboard only, reduced motion, JS off, venue Wi-Fi | 25 m | Bug list posted; fixes assigned |
| J10 | README sections: architecture, MANI workflow + prompts, embed/portal decisions, sources and fact-check table | 25 m | Sections written from the prompt log |

### ZJ — fog hero and the main website (~4 h)

| # | Task | Est. | Done when |
|---|---|---|---|
| Z1 | Fog hero (`hero.js`) | 70 m | **Done** — placeholder image until Jack's spawn screenshot arrives |
| Z2 | Page skeleton + `styles.css` + `motion.js` | 40 m | **Done** |
| Z3 | Section 3 real-photo moment (layout and copy; Jack wires the `#returned` trigger) + Section 4 tap-through story with growing root line | 45 m | **Done** |
| Z4 | Section 5 counters + Section 6 programmes | 30 m | **Done** |
| Z5 | Section 7 the ask: programme selection, message update, donation end-card | 25 m | **Done** |
| Z6 | README sections: how IRPH updates the page, how to make the next campaign page, AI use, credits | 25 m | Sections written from the prompt log |

### Hand-offs
- Jack → ZJ: repo access (J1), `AppData` (J3), spawn screenshot (J5).
- ZJ → Jack: hero hooks exposed from `hero.js` as `window.Hero` — `onWalk(fn)`, `onSkip(fn)`,
  `onCleared(fn)`, `dismiss()`, `reset()`, `img`. See the comment at the top of `hero.js`.
- Section IDs: `#hero`, `#walk`, `#real`, `#change`, `#evidence`, `#programmes`, `#ask`.

### Shared
- Log every AI prompt in `PROMPT_LOG.md` as you go (one line on what you kept or fixed).
- Check in at the halfway point and 45 minutes before close; cut order if behind:
  root-line animation → "Entering…" polish → programme detail → anything not on the critical path.
- **Never cut:** fog hero, skip-the-walk path, real-photo moment, verified stats, donation CTA, README.
- Last 15 minutes: run `build.py`, open `dist/index.html`, submit.

---

## 5. Workflow doc (README.md) outline

1. What we made and why (how it answers the brief's three questions)
2. Architecture: separate dev files → `build.py` → one submitted file; `AppData`
3. How IRPH updates this page without coding
4. How to make the next campaign page with this workflow
5. MANI: prompts, iterations, embed test result, portal design, why the walk is skippable
6. AI use: tools, real prompts, what AI got wrong, what humans verified
7. Sources and fact-checks: claim | wording on page | source | page | checked by
8. Credits and permissions
9. Scoped out / future

---

## 6. MANI world prompt (current)

```
An imagined walk from a grey, foggy city street into a warm community garden at golden
hour. Start on a cold monochrome pavement with bare walls and mist. A gravel path leads
gradually into green: allotment beds, fruit trees, wildflowers, and a small circle of
wooden benches where people could gather. Low amber sunlight, long shadows, soft mist
lifting. Small human traces: a hand-painted "welcome" sign, bunting on a fence, a flask
on a bench. No people. At the end of the path, a softly glowing circular portal.
Mood: hopeful, calm, intimate. Palette: moss green, terracotta, warm amber, mist grey.
First-person walking, gentle pace.
```
