# ZJ draft (alternative implementation)

A separate take on the "Clear the Dark" plan, kept apart so nothing on `main` is overwritten.
Differences from `main`: Emotion-style UX layer (kinetic word reveals, cursor ring, magnetic
buttons, section counter), a "What matters to you?" leaf input in the Listen step, and a
"Sources, AI use & workflow" panel with a fact-check table.

Run: `cd zj-draft && python3 -m http.server 4180`. Build one file: `python3 build.py` (writes `zj-draft/dist/`).
Images are not included; copy from `../assets/` and update the paths in `src/data.js`.
