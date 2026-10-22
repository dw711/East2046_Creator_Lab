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
    // Screenshot of the MANI world's spawn view. Swap in assets/spawn.jpg when Jack has it.
    image: "assets/spawn-placeholder.svg",
    imageAlt: "A grey, misty street with a path leading towards a golden garden in the distance.",
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

  links: {
    // Published MANI world URL (Jack, J5). Used by the walk button when JS is off.
    maniWorld: "#walk",
    donate: "https://interculturalroots.org/make-a-donation"
  }
};
