/* ------------------------------------------------------------------
   AppData — every word, number, link and credit on the page.
   Non-coders: edit the text between the quote marks, save, reload.
   Everything here comes from the IRPH Creator Lab brief unless marked VERIFY.
------------------------------------------------------------------- */
window.AppData = {
  org: {
    name: 'Intercultural Roots for Public Health',
    short: 'IRPH',
    charity: 'Registered Charity No. 1179885'
  },

  // Donation link (from the brief). Do not add amounts or claim where money goes.
  donateUrl: 'https://interculturalroots.org/make-a-donation',

  // MANI Engine published world link (Jack: paste it here after task J4).
  // Leave '' to show the "walk not connected yet" state.
  worldUrl: '',

  hero: {
    kicker: 'Intercultural Roots for Public Health',
    prompt: 'Click and drag to clear the dark spot.',
    clearBtn: 'Clear it for me',
    walkBtn: 'Walk out of the dark spot →',
    skipBtn: 'Skip the walk'
  },

  quote: {
    text: '“EcoGPX® helped me get out of a dark spot I was in. It allowed me to reconnect with myself, with others and with the world around me and nature.”',
    attribution: 'Participant, EcoGPX Coventry Launchpad'
  },

  real: {
    line: 'That garden was imagined. These people are real.',
    title: 'Creativity reconnects us.',
    body: 'Loneliness, inequality and disconnection affect how we live. We bring artists, practitioners and communities together to improve wellbeing, strengthen belonging and reconnect people with nature and place.',
    photo: {
      src: 'assets/ecogpx-group.jpg', // add after permission (task J2)
      alt: 'A group of people smiling together outdoors at EcoGPX Coventry',
      credit: 'EcoGPX Coventry, 2024. Image: Intercultural Roots.'
    }
  },

  change: {
    title: 'How change happens',
    steps: [
      { n: '01', title: 'Listen', text: 'Start with “What Matters to You?”' },
      { n: '02', title: 'Create together', text: 'Arts, movement, storytelling and cultural exchange.' },
      { n: '03', title: 'Connect', text: 'Community participation and ethical technology, shaped by lived experience.' }
    ],
    listen: {
      label: 'What matters to you?',
      placeholder: 'One word, e.g. belonging',
      button: 'Plant it',
      note: 'Stays on your screen only. Nothing is saved or sent.'
    }
  },

  evidence: {
    title: 'Real people. Real connection.',
    stats: [
      { value: 1729, suffix: '', label: 'people engaged with activities, resources and events' },
      { value: 789, suffix: '', label: 'network members' },
      { value: 50, suffix: '+', label: 'countries represented' }
    ],
    period: '2024–25 impact',
    source: 'Source: IRPH Impact Report 2024–25, pp. 3 and 10.'
  },

  programmes: {
    title: 'What IRPH does',
    // VERIFY: ask messages use only brief wording; check against interculturalroots.org.
    items: [
      { name: 'Creative health', ask: 'Help more people find creative health programmes.' },
      { name: 'Arts Disability Network', ask: 'Help more people find the Arts Disability Network.' },
      { name: 'EcoGPX®', ask: 'Help more people find programmes like EcoGPX®.' },
      { name: 'Forum Theatre', ask: 'Help more people find Forum Theatre.' }
    ]
  },

  ask: {
    title: 'What would you help grow?',
    hint: 'Tap one.',
    heading: 'Help Intercultural Roots reach more people.',
    sub: 'Donate. Be part of what grows next.',
    button: 'Donate',
    urlText: 'interculturalroots.org/make-a-donation'
  },

  footer: {
    mani: 'The 3D garden is an imagined space generated with MANI Engine.',
    ai: 'Built with AI assistance — see the workflow panel and README.',
    // Brief credits, use exactly next to each image.
    credits: [
      'Boal Forum Theatre, 2024. Image: Intercultural Roots.',
      'EcoGPX Coventry, 2024. Image: Intercultural Roots.',
      'EcoGPX Coventry, 2024. Photo: Kopal Gupta.',
      'Bridging Cultures, Coventry, 2025. Image: Intercultural Roots.'
    ]
  },

  // Fact-check table shown in the “Sources, AI use & workflow” panel.
  facts: [
    { claim: 'People engaged', page: '1,729 people engaged with activities, resources and events', source: 'IRPH Impact Report 2024–25', pp: '3, 10', by: '[name]' },
    { claim: 'Network members', page: '789 network members', source: 'IRPH Impact Report 2024–25', pp: '3, 10', by: '[name]' },
    { claim: 'Countries', page: '50+ countries represented', source: 'IRPH Impact Report 2024–25', pp: '3, 10', by: '[name]' },
    { claim: 'Participant quote', page: 'EcoGPX® “dark spot” quote', source: 'Creator Lab brief, slide 3', pp: '3', by: '[name]' },
    { claim: 'Charity number', page: 'Registered Charity No. 1179885', source: 'Creator Lab brief, slide 5', pp: '5', by: '[name]' }
  ],
  aiUse: [
    'MANI Engine — generated the imagined 3D garden walk (prompt in README).',
    'Code assistant(s) — drafted HTML/CSS/JS; humans reviewed and tested. [Confirm tools used: Claude / Codex]',
    'No AI-generated people, photos, quotes or statistics. All facts come from the IRPH brief and impact report.'
  ]
};
