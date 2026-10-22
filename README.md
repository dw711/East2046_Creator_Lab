# Clear the Dark — IRPH interactive web page

Track 2 (Interactive Web Page), CapCut × EAST2046 Cambridge Creator Lab, for Intercultural Roots for Public Health (Registered Charity No. 1179885).

See `PLAN.md` for the plan and task split. Workflow write-up to follow (J10, Z6).

## Run locally

Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and open http://localhost:8000.

## Files

| File | What | Owner |
|---|---|---|
| `src/data.js` | `AppData`: every word, number, credit and link | Jack |
| `src/styles.css` | All styles (Jack's overlay block at the end) | ZJ |
| `src/hero.js` | Fog hero | ZJ |
| `src/world.js` | MANI overlay, portal, `#returned` | Jack |
| `src/sections.js` | Fills copy from `AppData`; tap-through, counters, the ask | ZJ |
| `src/orbs.js` | Connection field: 50 orbs (one per country), cursor pushes, grab and throw, links re-form | ZJ |
| `src/motion.js` | Preloader, smooth scroll, cursor, text/image reveals, magnetic buttons, theme switching, marquee | ZJ |
| `build.py` | Inlines everything into `dist/index.html` | Jack |

Section IDs: `#hero`, `#walk`, `#real`, `#change`, `#evidence`, `#programmes`, `#ask`.

## Palette (sampled from the IRPH brief PDF)

Green `#163D32` · Cream `#F5F1E7` · Lime `#D4E781` · Terracotta `#A66B50`

## Motion and design inspiration

The motion layer (`src/motion.js`) is our own code, with no libraries. Its look and feel was
inspired by award-site conventions, in particular Emotion Agency (emotion-agency.com, featured
on Awwwards): a percentage preloader, huge statement type with ↪ arrows, mono index labels such
as "(001)", spec-list rows with hairline rules, pill tags, and button labels that roll on hover.
No code, fonts or assets were taken from their site. Their font (PP Neue Montreal) is commercial,
so we use Rubik (which matches the IRPH brief) with IBM Plex Mono for labels, both from Google Fonts
under the Open Font License.

All motion respects `prefers-reduced-motion`, and the page reads fully with JavaScript off.

## Photos

The five images in `assets/` were extracted from the IRPH Creator Lab brief PDF and compressed
(all under 160 KB). Credits are shown next to each photo exactly as written in the brief.
**Permission to use them on the page is still being confirmed with the organisers (J2).**
