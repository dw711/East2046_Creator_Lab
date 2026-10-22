# Clear the Dark — workflow and sources

CapCut × EAST2046 · Cambridge Creator Lab · Track 2 — Interactive Web Page · 22 October 2026
Partner: Intercultural Roots for Public Health (IRPH), Registered Charity No. 1179885

A PDF version of this document is in [`docs/workflow.pdf`](docs/workflow.pdf).

An interactive page for IRPH: a visitor clears a “dark spot”, walks through an imagined 3D garden, and arrives at the real people, the evidence and the ask. Audience (from the brief): people discovering IRPH for the first time, especially potential donors. The submitted file is `dist/index.html`, which works offline.

## 1. What we made, and how it answers the brief

| Section | Brief question | Interaction | Content source |
|---|---|---|---|
| Fog hero | Hook | Drag (or move) to clear the fog; “Clear it for me” button | Participant quote, brief slide 3 |
| MANI walk | Hook → story | First-person 3D walk (WASD / arrows), portal back to the page | Imagined space, made in MANI Engine |
| These people are real | Why do we exist? | Scroll reveal | Mission text, slide 2; EcoGPX Coventry photo, slide 2 |
| How change happens | How does change happen? | Scroll-driven steps: the section pins and Listen → Create together → Connect advance as you scroll | Slide 2 |
| Real people. Real connection. | Evidence | Count-up numbers with progress bars; 50 interactive orbs (push, grab, throw) for “50+ countries” | IRPH Impact Report 2024–25, pp. 3 and 10 (cited on slide 3) |
| What we do | What do we do? | Indexed list with hover; scrolling marquee | Programme names, slide 2 |
| What would you help grow? | The ask | Pick a programme → message updates, a sprout grows; Donate button | Ask and URL, slide 5 |

The page has more than the two interaction types the track requires, and does not depend on any one of them: the 3D walk can be skipped, and the story, evidence and ask all work without it.

## 2. The reusable workflow

1. **Read the brief and list every claim.** Pull out the three questions, the audience, every number, quote, credit and link. Nothing goes on the page that is not on this list.
2. **Plan the page as a story, one section per question,** and give each section one interaction. Write down what is never cut (hook, skip-the-walk path, verified stats, donate button, this document).
3. **Split the work** so people do not edit the same lines: one person on the 3D world and integration, others on the hero and the sections. Agree section IDs (`#hero`, `#walk`, `#real`, `#change`, `#evidence`, `#programmes`, `#ask`) first.
4. **Build the 3D world in MANI Engine from a written prompt** (section 4). Screenshot its spawn view and use that same image under the fog, so the hand-off into the live world looks like one shot.
5. **Build the page** as one `index.html` with CSS and JS inside. Use real HTML text (never text baked into images), animate only transform and opacity, and respect reduced-motion settings.
6. **Fact-check** every claim against its source and record it in the table in section 5.
7. **Test** on a laptop and a 375 px phone, by keyboard, with reduced motion, with the 3D walk skipped, and from the built file opened straight from disk.
8. **Build and submit:** `python3 build.py` inlines the images and writes `dist/index.html` (about 610 KB), which is the file we submit.

### To make the next campaign page

- **Keep:** the section structure, the build script, the fog hook, the scroll-driven steps, the counters and bars, the ask, and this document as a template.
- **Swap:** the quote, mission text, steps, numbers, photos and credits (all in `index.html`), the MANI world URL in the `<iframe id="world">`, and the spawn screenshot `assets/opening.jpg`.
- **Re-run** steps 6–8: fact-check, test, build.

## 3. How it is built

- **One page, no frameworks.** Plain HTML, CSS and JavaScript in `index.html`; no libraries to install.
- **`build.py`** turns every `assets/…` image into an embedded data URL and writes `dist/index.html` (to submit) and `dist/mani-scene.html` (a copy that opens links in the same tab, for hosting inside MANI).
- **Type:** Instrument Serif (headlines), Inter (body), IBM Plex Mono (labels), all from Google Fonts under the SIL Open Font License.
- **Accessibility:** all text is real HTML; reduced-motion users get final numbers and no animation; “Skip the walk” is a plain link that works without JavaScript; the orb field and decorative art are hidden from screen readers.
- **Offline:** everything but the 3D walk and the web fonts works with no connection; fonts fall back to system fonts.

## 4. The MANI walk

The world is a MANI Engine project, embedded with an `<iframe>` that starts loading as soon as the page opens. Visitors enter it automatically about 8 seconds after the fog clears, by pressing “Enter now”, or by scrolling down; a full-screen copy of the spawn view covers the jump so it looks continuous.

**Getting back out.** The world’s exit function sends `{ type: 'irph:returned' }` to our page when the visitor reaches the portal, the “Skip ahead” ring or the world’s own skip button. Our page trusts that message by its source window (MANI runs worlds in a sandbox, so their origin is `null`), fades to dark and lands on “These people are real”. Backups: any second load inside the frame counts as the walk ending, and our own “Skip the walk” links always work. Full details: [`MANI_LINK.md`](MANI_LINK.md).

**World prompt** (as recorded in our plan):

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

> **Team to confirm:** the final world (Coventry Edgelands trail: gate, bus shelter, iron fence, misty woodland, IRPH signage) was iterated from this prompt in MANI. Add the final prompt and the main iterations here before submitting.

## 5. Sources and fact-check

Every number, quote and credit on the page comes from the IRPH Creator Lab brief (5 slides). The page invents no people, quotes, statistics or donation amounts, and choosing a programme in the ask does not claim the donation goes to that programme.

| Claim | Wording on page | Source | Page | Checked by |
|---|---|---|---|---|
| People engaged | 1,729 people engaged with activities, resources and events | IRPH Impact Report 2024–25, cited in brief slide 3 | 3, 10 | ________ |
| Network members | 789 network members | IRPH Impact Report 2024–25, cited in brief slide 3 | 3, 10 | ________ |
| Countries | 50+ countries represented | IRPH Impact Report 2024–25, cited in brief slide 3 | 3, 10 | ________ |
| Participant quote | “EcoGPX® helped me get out of a dark spot I was in…” — Participant, EcoGPX Coventry Launchpad | Brief slide 3 | 3 | ________ |
| Mission | “Creativity reconnects us.” and “Loneliness, inequality and disconnection affect how we live…” | Brief slide 2 | 2 | ________ |
| How change happens | Listen / Create together / Connect, with their one-line descriptions | Brief slide 2 | 2 | ________ |
| Programmes | Creative health · Arts Disability Network · EcoGPX® · Forum Theatre | Brief slide 2 | 2 | ________ |
| The ask | “Help Intercultural Roots reach more people. Donate. Be part of what grows next.” and the donation URL | Brief slide 5 | 5 | ________ |
| Charity number | Registered Charity No. 1179885 | Brief slide 5 | 5 | ________ |

## 6. AI use

| Tool | What it did | What people decided, checked or fixed |
|---|---|---|
| MANI Engine | Generated the imagined 3D garden walk from a written prompt. | Team iterated the world, set the spawn view and the exit behaviour, and tested that it embeds. |
| Claude (Claude Code) | Drafted HTML, CSS and JavaScript: the fog hero, the orb field, the scroll-driven steps, the progress bars, the footer’s sources panel, and fixes; reviewed the plan; helped merge team members’ versions. | The team chose the concept, wrote the plan, picked which version became the final page (Jack’s layout), and reviewed every change in a browser preview. |
| **Other tools?** | **Add any other AI tools the team used (e.g. ChatGPT, Codex) and what for.** | |

### Where AI output was corrected or limited

- **No copying.** We asked for the interactions of an award-winning agency site. The assistant declined to copy that site’s code or its commercial font, and wrote original interactions inspired by the same conventions instead (credited below).
- **Exact wording.** A draft quote used the emoji version of the ® symbol; it was corrected to the plain ® used in the brief. Brand colours were sampled from the brief PDF rather than guessed.
- **Bugs caught in testing:** photos inside hidden step panels never loaded; the photo frame stretched to the image’s shape; the first orb “push” was too weak to notice. All fixed and re-tested.
- **Honest numbers.** The progress bars show each counter’s own progress, not a comparison between the three stats, because they measure different things (people, members, countries).
- **Not AI-generated:** no people, photos, quotes or statistics. The photo is IRPH’s own, used with permission.

## 7. Credits and permissions

- **Photo:** EcoGPX Coventry, 2024. Image: Intercultural Roots. Supplied in the brief; permission to use it on the page confirmed with the organisers.
- **Other brief photos** (credited in the page footer as the brief lists them): Boal Forum Theatre, 2024. Image: Intercultural Roots. · EcoGPX Coventry, 2024. Photo: Kopal Gupta. · Bridging Cultures, Coventry, 2025. Image: Intercultural Roots.
- **Logo** and all wording: Intercultural Roots for Public Health, from the brief.
- **3D world:** an imagined space generated with MANI Engine; the page says so in its footer.
- **Fonts:** Instrument Serif, Inter, IBM Plex Mono (Google Fonts, SIL Open Font License).
- **Design inspiration:** award-site conventions, in particular Emotion Agency (emotion-agency.com, featured on Awwwards): large serif statements, mono index labels, rolling button labels. No code, fonts or assets were taken from it.

## 8. Files

| File | What it is |
|---|---|
| `index.html` | The page: all markup, styles and scripts. |
| `build.py` | Inlines images; writes `dist/index.html` and `dist/mani-scene.html`. |
| `dist/index.html` | The submitted single file. |
| `assets/` | `opening.jpg` (MANI spawn view), `ecogpx-coventry-group-2024.jpg`, `irph-logo.jpg`. |
| `MANI_LINK.md` | How the page enters and returns from the MANI walk. |
| `PLAN.md` | The team’s plan and task split. |
| `WORKFLOW.md` / `docs/workflow.pdf` | This document (`docs/workflow.html` is the PDF’s source). |
