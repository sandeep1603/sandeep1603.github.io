(function () {
  "use strict";
  var root = document.documentElement;

  // Theme: follows the system until the visitor picks one; the choice is kept in this browser only.
  var toggle = document.querySelector(".theme-toggle");
  var dark = window.matchMedia("(prefers-color-scheme: dark)");
  function current() { return root.dataset.theme || (dark.matches ? "dark" : "light"); }
  function label() {
    var next = current() === "dark" ? "light" : "dark";
    toggle.setAttribute("aria-label", "Switch to " + next + " theme");
    toggle.title = "Switch to " + next + " theme";
  }
  toggle.hidden = false;
  label();
  toggle.addEventListener("click", function () {
    root.dataset.theme = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    label();
  });
  dark.addEventListener("change", label);

  // Copy the email address. Some viewers can't open mailto: links, so the address is also plain text.
  var copy = document.querySelector(".copy");
  var copied = document.querySelector(".copied");
  copy.hidden = false;
  copy.addEventListener("click", function () {
    var address = copy.dataset.copy;
    function selectIt() {
      var range = document.createRange();
      range.selectNodeContents(document.getElementById("email"));
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copied.textContent = "Selected. Press Ctrl+C or ⌘C to copy.";
    }
    try {
      navigator.clipboard.writeText(address).then(function () { copied.textContent = "Copied."; }, selectIt);
    } catch (e) { selectIt(); }
  });

  // Projects, from projects.js.
  var list = document.getElementById("projects");
  var projects = window.PROJECTS;
  if (!list || !Array.isArray(projects)) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Escaped text, with every [VERIFY ...] note highlighted.
  function text(s) {
    return esc(s).replace(/\[VERIFY[^\]]*\]/g, function (m) { return '<mark class="verify">' + m + "</mark>"; });
  }
  function chips(items) {
    return '<ul class="chips">' + items.map(function (s) { return "<li>" + text(s) + "</li>"; }).join("") + "</ul>";
  }
  // The tile shows the same drawing as the case study, as decoration, with its ids renamed so they stay unique.
  function tileArt(svg) {
    return svg
      .replace(/ role="img" aria-labelledby="[^"]*"/, ' aria-hidden="true" focusable="false"')
      .replace(/id="([^"]+)"/g, 'id="$1-tile"')
      .replace(/url\(#([^)]+)\)/g, "url(#$1-tile)");
  }
  function title(p) {
    return text(p.title) + (p.status ? ' <span class="badge">' + text(p.status) + "</span>" : "");
  }

  list.innerHTML = projects.map(function (p, i) {
    var t = "t" + (p.tint || 1);
    return '<article class="tile ' + t + '">' +
      (p.figure ? '<div class="tile-art">' + tileArt(p.figure.svg) + "</div>" : "") +
      '<div class="tile-body">' +
        '<p class="tile-context">' + text(p.context) + "</p>" +
        "<h3>" + title(p) + "</h3>" +
        '<p class="tile-summary">' + text(p.summary) + "</p>" +
        chips(p.stack.slice(0, 4)) +
        '<button class="open-case" type="button" data-i="' + i + '">Read case study <span aria-hidden="true">→</span></button>' +
      "</div></article>";
  }).join("");

  var dialog = document.getElementById("case");
  var body = document.getElementById("case-body");
  var opener = null;

  function caseStudy(p) {
    var approach = Array.isArray(p.approach)
      ? "<ul>" + p.approach.map(function (a) { return "<li>" + text(a) + "</li>"; }).join("") + "</ul>"
      : "<p>" + text(p.approach) + "</p>";
    var figure = p.figure
      ? '<figure class="fig t' + (p.tint || 1) + '">' + p.figure.svg +
        (p.log ? '<pre class="log" tabindex="0" aria-label="Example audit-log entry, synthetic"><code>' + esc(p.log) + "</code></pre>" : "") +
        "<figcaption>" + text(p.figure.caption) + "</figcaption></figure>"
      : "";
    var links = (p.links || []).map(function (l) {
      return "<li>" + (l.href
        ? '<a href="' + esc(l.href) + '" target="_blank" rel="noopener noreferrer">' + text(l.label) + "</a>"
        : text(l.label)) + "</li>";
    }).join("");
    return '<p class="tile-context">' + text(p.context) + "</p>" +
      '<h2 id="case-title">' + title(p) + "</h2>" +
      '<p class="tile-summary">' + text(p.summary) + "</p>" +
      figure +
      "<h3>Problem</h3><p>" + text(p.problem) + "</p>" +
      "<h3>Approach</h3>" + approach +
      "<h3>Result</h3><p>" + text(p.result) + "</p>" +
      "<h3>Stack</h3>" + chips(p.stack) +
      (p.next ? "<h3>What I would do next</h3><p>" + text(p.next) + "</p>" : "") +
      (links ? '<ul class="case-links">' + links + "</ul>" : "");
  }

  list.addEventListener("click", function (e) {
    var btn = e.target.closest(".open-case");
    if (!btn) return;
    opener = btn;
    body.innerHTML = caseStudy(projects[+btn.dataset.i]);
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  dialog.querySelector(".case-close").addEventListener("click", function () { dialog.close(); });
  // A click on the dimmed backdrop (the dialog element itself, outside its content) closes it.
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", function () { if (opener) opener.focus(); });
})();
