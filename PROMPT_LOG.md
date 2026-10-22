# Prompt log

Every AI prompt, by whoever used it. One line on what we kept or fixed.

| When | Who | Tool | Prompt (short) | Kept / fixed |
|---|---|---|---|---|
| 22 Oct | ZJ | Claude Code | "do Z1" (fog hero, from PLAN.md) | Kept: fog canvas, coverage grid, "Clear it for me" sweep, hooks for world.js. Checked: quote copied word for word from brief p.3; plain ® not emoji ®️; palette sampled from the brief PDF. |
| 22 Oct | ZJ | Claude Code | "use the ux features from emotion-agency.com … same interactions and animations" | Claude would not copy the site's code or fonts (copyright, and the workflow doc must list sources). Instead it wrote original motion.js (preloader, smooth scroll, cursor, reveals, magnetic buttons, theme switching, marquee) and built sections 3–7 + footer in that style. Checked: all copy from the brief; stats match p.3; credits next to each photo; tested laptop, 375 px phone, reduced motion, JS off. |
| 22 Oct | — | Claude Code | "take screenshots from emotion-agency.com and integrate UX features, such as mouse interactions with the balls and 3d visuals" | Site blocked from the build environment, and Claude would not recreate it from screenshots anyway. Instead it wrote an original orb field (orbs.js): 50 shaded 3D-looking orbs for "50+ countries represented", linked when close; the cursor pushes them apart and they reconnect. Tuned push strength after the first test was too subtle. |
| 22 Oct | — | Claude Code | "are there any useful parts of zj's branch" / "ok do it" | Merged from branch zj-draft-clear-the-dark: build.py (as is), world.js (rewired to main's Hero/Motion hooks; added walk.embed switch because browsers fire iframe load even when embedding is refused), "What matters to you?" leaf input, Back button + arrow keys, Sources/AI use/workflow panel. Tested walk → portal → return with a stand-in world page. Found and fixed: step 2 and 3 photos never loaded (lazy loading inside a clipped frame). |
