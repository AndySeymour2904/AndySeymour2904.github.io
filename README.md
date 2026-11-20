# andyseymour.dev

Personal site and CV, written as a short maths paper. Plain HTML, CSS and JS in `site/`, with no build step.

- **Preview:** `python3 -m http.server -d site 8080`
- **Deploy:** push to `dev`. The workflow publishes `site/` to the `master` branch, which GitHub Pages serves at andyseymour.dev (`site/CNAME`).
- **Print as CV:** the print stylesheet turns the page into an A4 CV (the "Print as CV" button, or Ctrl+P → Save as PDF).
