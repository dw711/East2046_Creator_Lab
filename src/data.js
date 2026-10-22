/*
 * AppData — every word, number, credit and link on the page lives here.
 * To change the page, edit the text between the quotes and save. No other file needs touching.
 *
 * Owner: Jack (J3). Filled in from the IRPH Creator Lab brief (PDF); page numbers in comments.
 * Photo alt text is ours (describes what is in each photo); everything else is the brief's wording.
 */
window.AppData = {
  site: {
    name: "Intercultural Roots",
    fullName: "Intercultural Roots for Public Health",
    charity: "Registered Charity No. 1179885",                 // brief p.5
    logo: "assets/irph-logo.jpg"
  },

  hero: {
    // Screenshot of the MANI world's spawn view (opening.png cropped to drop the MANI HUD).
    image: "assets/opening.jpg",
    imageAlt: "The start of the walk: past a slatted gate and a bus shelter, a gravel path winds through an iron fence into misty woodland.",
    prompt: "Click and drag to clear the dark spot.",
    promptTouch: "Drag your finger to clear the dark spot.",
    clearForMe: "Clear it for me",
    // Brief p.3. Plain ® (U+00AE), not the emoji form.
    quote: "“EcoGPX® helped me get out of a dark spot I was in. It allowed me to reconnect with myself, with others and with the world around me and nature.”",
    quoteBy: "Participant, EcoGPX Coventry Launchpad",
    walk: "Walk out of the dark spot →",
    skip: "Skip the walk",
    // Share of the fog (0–1) that must be cleared before it dissolves.
    clearThreshold: 0.45,
    // Seconds between the quote appearing and the buttons appearing.
    buttonsDelay: 3
  },

  real: {
    imagined: "That garden was imagined.",
    real: "These people are real.",
    photo: "assets/ecogpx-coventry-group-2024.jpg",
    photoAlt: "A large group of adults and children smiling together in a leafy garden, some wearing flower crowns, one holding a hand-painted banner.",
    photoCredit: "EcoGPX Coventry, 2024. Image: Intercultural Roots.",   // brief p.2
    heading: "Creativity reconnects us.",                                  // brief p.2
    body: "Loneliness, inequality and disconnection affect how we live. We bring artists, practitioners and communities together to improve wellbeing, strengthen belonging and reconnect people with nature and place."
  },

  change: {
    label: "How change happens",
    next: "Next step →",
    back: "← Back",
    // "What matters to you?" — visitor plants a word on the root line. Nothing is stored.
    listen: {
      label: "What matters to you?",
      placeholder: "One word, e.g. belonging",
      button: "Plant it",
      note: "Stays on your screen only. Nothing is saved or sent."
    },
    last: "See the impact ↓",
    // brief p.2
    steps: [
      {
        num: "01", title: "Listen", text: "Start with “What Matters to You?”",
        image: "assets/bridging-cultures-2025.jpg",
        alt: "A facilitator speaks to a circle of participants standing in a bright studio.",
        credit: "Bridging Cultures, Coventry, 2025. Image: Intercultural Roots."
      },
      {
        num: "02", title: "Create Together", text: "Arts, movement, storytelling and cultural exchange.",
        image: "assets/forum-theatre-2024.jpg",
        alt: "A man in a blue scarf raises his arms in a forum theatre session, with a group moving behind him.",
        credit: "Boal Forum Theatre, 2024. Image: Intercultural Roots."
      },
      {
        num: "03", title: "Connect", text: "Community participation and ethical technology, shaped by lived experience.",
        image: "assets/ecogpx-coventry-hearts-2024.jpg",
        alt: "Three people smile in a sunny garden, holding up heart shapes woven from willow.",
        credit: "EcoGPX Coventry, 2024. Photo: Kopal Gupta."
      }
    ]
  },

  evidence: {
    heading: "Real people. Real connection.",                             // brief p.3
    label: "2024–25 impact",
    // value = the number counted up to; suffix is added after it.
    stats: [
      { value: 1729, suffix: "", label: "people engaged with activities, resources and events" },
      { value: 789, suffix: "", label: "network members" },
      { value: 50, suffix: "+", label: "countries represented" }
    ],
    source: "Source: IRPH Impact Report 2024–25, pp. 3 and 10."
  },

  // The orb field in the impact section: one orb per country represented (brief p.3: 50+).
  orbs: {
    count: 50,
    label: "50+ countries represented",
    hint: "Move through them, or grab one and throw it. Watch them find each other again."
  },

  programmes: {
    label: "What we do",
    items: ["Creative health", "Arts Disability Network", "EcoGPX®", "Forum Theatre"]   // brief p.2
  },

  ask: {
    question: "What would you help grow?",
    // {programme} is replaced with the one the visitor picks.
    message: "Help more people find programmes like {programme}.",
    line1: "Help Intercultural Roots reach more people.",                  // brief p.5
    line2: "Donate. Be part of what grows next.",
    button: "Donate",
    urlText: "interculturalroots.org/make-a-donation"
  },

  footer: {
    ai: "Built with AI assistance — see the workflow doc.",
    mani: "The 3D garden is an imagined space generated with MANI Engine."
  },

  // MANI walk overlay (world.js). Set embed to false if the world won't load in an iframe (J4).
  walk: {
    embed: true,
    entering: "Entering…",
    newTab: "Open the walk in a new tab",
    hint: "Click to start, then use arrow keys or WASD to walk.",
    portal: "Step through the portal",
    skip: "Skip the walk"
  },

  // Fact-check table in the footer's "Sources, AI use & workflow" panel.
  // TODO team: put your names in "by" once you've checked each row against the source.
  facts: [
    { claim: "People engaged", page: "1,729 people engaged with activities, resources and events", source: "IRPH Impact Report 2024–25 (quoted in the Creator Lab brief, slide 3)", pp: "3 and 10", by: "To confirm" },
    { claim: "Network members", page: "789 network members", source: "IRPH Impact Report 2024–25 (quoted in the Creator Lab brief, slide 3)", pp: "3 and 10", by: "To confirm" },
    { claim: "Countries", page: "50+ countries represented", source: "IRPH Impact Report 2024–25 (quoted in the Creator Lab brief, slide 3)", pp: "3 and 10", by: "To confirm" },
    { claim: "Participant quote", page: "EcoGPX® “dark spot” quote", source: "Creator Lab brief, slide 3", pp: "3", by: "To confirm" },
    { claim: "Mission statement", page: "“Loneliness, inequality and disconnection…”", source: "Creator Lab brief, slide 2", pp: "2", by: "To confirm" },
    { claim: "Charity number", page: "Registered Charity No. 1179885", source: "Creator Lab brief, slide 5", pp: "5", by: "To confirm" }
  ],

  // TODO team: add any other AI tools you used (e.g. ChatGPT / Codex).
  aiUse: [
    "MANI Engine — generated the imagined 3D garden walk from a written prompt (prompt in README).",
    "Claude (Claude Code) — drafted HTML, CSS and JavaScript; the team reviewed and tested it. Every prompt is logged in PROMPT_LOG.md.",
    "No AI-generated people, photos, quotes or statistics. All facts come from the IRPH brief and impact report."
  ],

  links: {
    // Published MANI world URL (Jack, J5). Used by the walk button when JS is off.
    maniWorld: "https://maniengine.com/t/TjLS1dHz0fVh",
    donate: "https://interculturalroots.org/make-a-donation"
  }
};
