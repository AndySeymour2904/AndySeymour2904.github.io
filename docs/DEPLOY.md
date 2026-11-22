# Deploying andyseymour.dev on Cloudflare

The site is plain HTML, CSS and JS in `site/`. It runs as a **Cloudflare Worker with static assets**
(`wrangler.jsonc`), with no Worker script, so every request is an unmetered static-asset request.
**Workers Builds** deploys it from GitHub on every push to `master`, the same setup as TOPIK Trainer and
FPL Outlook, so no Cloudflare credentials live on the VM.

The build command, `npm run build`, runs `scripts/check.mjs`: it fails the deploy if a local link,
image or `#anchor` is missing or `script.js` doesn't parse.

## Setup (done 22 November 2026)

- Worker `andyseymour`, connected to `AndySeymour2904/AndySeymour2904.github.io` through Workers Builds:
  production branch `master`, build command `npm run build`, deploy command `npx wrangler deploy`.
  It uses the same GitHub connection and build token as TOPIK Trainer.
- A second trigger, *Preview branches*, builds every other branch with the same check and runs
  `npx wrangler versions upload`: a preview version with its own URL, without touching the live site.
  Cloudflare reports it as a check on the pull request, with the preview link.
- Email: Email Routing forwards `andy@andyseymour.dev` to `aseymour917+andyseymour@gmail.com`;
  every other address at the domain is dropped. *Always Use HTTPS* is on.
- Custom domain `andyseymour.dev` (Settings → Domains & Routes). `www.andyseymour.dev` has a proxied
  placeholder record `A www 192.0.2.1` and a Redirect Rule sending it to the apex with a 301, keeping the path and query.
- GitHub Pages is off. `master` used to hold the Pages build output; it is now the source branch, and `dev` is retired.

## Every release

```bash
npm run check     # link check + wrangler dry run
git push -u origin <branch>   # preview build + PR check
# open a PR into master on GitHub; merging deploys andyseymour.dev
```

Local preview on the VM: `npm run dev` → http://192.168.122.50:8787 (Cloudflare's runtime, so `_headers`
and the 404 page behave as in production), or `python3 -m http.server -b 0.0.0.0 -d site 8080`.
