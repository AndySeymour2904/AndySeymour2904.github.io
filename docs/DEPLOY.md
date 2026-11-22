# Deploying andyseymour.dev on Cloudflare

The site is plain HTML, CSS and JS in `site/`. It runs as a **Cloudflare Worker with static assets**
(`wrangler.jsonc`), with no Worker script, so every request is an unmetered static-asset request.
**Workers Builds** deploys it from GitHub on every push to `dev`, the same setup as TOPIK Trainer and
FPL Outlook, so no Cloudflare credentials live on the VM.

The build command, `npm run build`, runs `scripts/check.mjs`: it fails the deploy if a local link,
image or `#anchor` is missing or `script.js` doesn't parse.

## One-time setup

The `andyseymour.dev` zone is already on Cloudflare (nameservers `jewel`/`newt.ns.cloudflare.com`).

1. **Create the Worker from GitHub:** *Workers & Pages → Create application → Import a repository*
   → choose `AndySeymour2904/AndySeymour2904.github.io`, then set:
   - Project name: `andyseymour` (must match `name` in `wrangler.jsonc`)
   - Production branch: `dev`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (the default)
   - Non-production branch deploy command: `npx wrangler versions upload` (the default)
   - Root directory: blank

   *Save and Deploy*, then check the `andyseymour.<subdomain>.workers.dev` URL.
2. **Custom domain:** *Workers & Pages → andyseymour → Settings → Domains & Routes → Add → Custom domain*
   → `andyseymour.dev`. If the zone has an old `A`/`CNAME` record for the apex (GitHub Pages), delete it first.
3. **`www` → apex redirect.** In the `andyseymour.dev` zone, add DNS record `A www 192.0.2.1`, **proxied**,
   then *Rules → Redirect Rules → Create rule*: hostname equals `www.andyseymour.dev` → *Dynamic* →
   `concat("https://andyseymour.dev", http.request.uri.path)`, status **301**, preserve query string.
4. **Turn off GitHub Pages:** repo *Settings → Pages* → unpublish. The `master` branch (the old Pages
   output) is no longer used and can be deleted.
5. **Optional, Web Analytics:** *Web Analytics → Add a site* → `andyseymour.dev`. It's cookieless.

## Every release

```bash
npm run check     # link check + wrangler dry run
git push          # pushing dev deploys andyseymour.dev; other branches get a preview version only
```

Local preview on the VM: `npm run dev` → http://192.168.122.50:8787 (Cloudflare's runtime, so `_headers`
and the 404 page behave as in production), or `python3 -m http.server -b 0.0.0.0 -d site 8080`.
