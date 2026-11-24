# sandeep1603.github.io

Personal portfolio of Sandeep Raj. Plain HTML, CSS and a little JavaScript: no framework, no build step, no external requests.

| File | What it holds |
|---|---|
| `index.html` | The page: header, About, Experience, Skills, Contact, footer |
| `projects.js` | The project cards' content (the "Selected work" section) |
| `script.js` | Renders the project tiles, opens each case study, copies the email address, runs the light/dark toggle |
| `styles.css` | All styling, including both colour themes |
| `assets/` | Put `Sandeep_Raj_CV.pdf` here; the CV links point to it. `assets/fonts/` holds the heading typeface (Bricolage Grotesque, SIL Open Font License, see `OFL.txt`), served from the site itself |
| `TODO.md` | Your local to-do list (kept out of the repository by .gitignore) |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Edit the projects

Open `projects.js`. Each project is one `{ ... }` entry in `window.PROJECTS`; tiles appear in the same order, and the button on each tile opens the full case study. To add one, copy an entry and change its fields. The fields are described at the top of the file. `figure` is optional and takes inline SVG markup, which also becomes the tile's picture; `tint` picks the tile colour.

The data is a `.js` file rather than `.json` on purpose: browsers block reading a JSON file when you open `index.html` straight from disk, but a script file loads fine.

If you add a project, also add a one-line entry to the `<noscript>` list in `index.html`, which is what visitors without JavaScript see.

Anything written as `[VERIFY: ...]` shows up highlighted on the page. Remove each marker once the fact is confirmed or corrected.

## Preview locally

Open `index.html` in a browser. Or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a public repository named `sandeep1603.github.io` on GitHub.
2. Push these files to its `main` branch, at the repository root.
3. In the repository, go to **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. The site appears at `https://sandeep1603.github.io/` after a minute or two.

If you use a different address, update the `canonical` link and `og:url` in `index.html`.
