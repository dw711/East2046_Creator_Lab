/*
 * sections.js — fills the page from AppData and runs the story sections. Owner: ZJ.
 *
 * Text lives in the HTML too, so the page reads fine without JS. Elements marked
 *   data-copy="path.to.text"   get their text from AppData
 *   data-href="path.to.url"    get their link from AppData
 *   data-src / data-alt        get an image source / alt text from AppData
 */
(function () {
  "use strict";

  function lookup(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, window.AppData);
  }

  function applyCopy(root) {
    if (!window.AppData) return;
    root = root || document;
    [["data-copy", "textContent"], ["data-href", "href"], ["data-src", "src"], ["data-alt", "alt"]]
      .forEach(function (pair) {
        root.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
          var value = lookup(el.getAttribute(pair[0]));
          if (typeof value === "string") el[pair[1]] = value;
        });
      });
  }

  window.Sections = { lookup: lookup, applyCopy: applyCopy };
  applyCopy(document);

  // TODO ZJ: Z3 real-photo moment + tap-through, Z4 counters + programmes, Z5 the ask.
})();
