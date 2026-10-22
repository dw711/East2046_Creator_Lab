/*
 * AppData — every word, number, credit and link on the page lives here.
 * To change the page, edit the text between the quotes and save. No other file needs touching.
 *
 * Owner: Jack (J3). The hero block below was filled in by ZJ for Z1;
 * every string is copied from the IRPH Creator Lab brief (PDF), page 3.
 */
window.AppData = {
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

  links: {
    // Published MANI world URL (Jack, J5). Used by the walk button when JS is off.
    maniWorld: "#walk",
    donate: "https://interculturalroots.org/make-a-donation"
  }

  // TODO Jack (J3): story, stats, programmes, ask, credits.
};
