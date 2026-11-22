# andyseymour.dev

Personal site and CV. Plain HTML, CSS and JS in `site/`, with no framework.

- **Content:** the CV data (jobs, projects, skills, links) is the `CV` object at the top of `site/script.js`.
  The photo is `site/img/me.jpg`.
- **The prompt:** commands live in `COMMANDS` in `site/script.js`; anything starting with `sudo` is the easter egg.
- **Preview:** `npm install`, then `npm run dev` → http://192.168.122.50:8787
- **Check:** `npm run check` (broken links, missing images, JS syntax, wrangler dry run).
- **Deploy:** push to `master`. Cloudflare Workers Builds serves `site/` at andyseymour.dev. Setup: [docs/DEPLOY.md](docs/DEPLOY.md).
- **Print as CV:** the print stylesheet turns the page into a CV (the `cv` command, the CV link, or Ctrl+P → Save as PDF).
