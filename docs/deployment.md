# Publishing on GitHub Pages

The collection is hosted from **PaulGibbs3rd/30DayMapChallenge2026**, using **Deploy from a branch → main → / (root)**.

| Page | URL |
| --- | --- |
| Collection entry point | https://paulgibbs3rd.github.io/30DayMapChallenge2026/ |
| Directory | https://paulgibbs3rd.github.io/30DayMapChallenge2026/directory/ |
| Day 1 map | https://paulgibbs3rd.github.io/30DayMapChallenge2026/day1/ |

Other day pages use the same address followed by `dayN/`. Day 1 is implemented. Days 2–30 are clearly labeled placeholders until their maps are created.

## How publication works

GitHub publishes the committed files at the repository root whenever changes reach `main`. The root `index.html` opens the directory. A committed `.nojekyll` file keeps the site as plain static files, including the GeoJSON and JavaScript modules.

The separate **Validate challenge collection** workflow checks data, assets, local links, and the generated directory. It runs on pushes, pull requests, and manual dispatch. It does not deploy or change the repository's Pages settings. GitHub's **pages build and deployment** workflow performs the actual branch publication.

## Run and check locally

Use Node.js 24. There are no npm dependencies to install.

```sh
npm run check
npm run dev
```

The preview prints a URL under `/30DayMapChallenge2026/`, matching the GitHub Pages project prefix. Reload after source changes.

The check command validates Day 1 data and song mappings, regenerates `directory/index.html`, stages the public runtime and notes in `_site/`, and verifies local references. The staged directory is a validation/preview artifact, not the branch publishing source.

To preview that staged output:

```sh
node scripts/serve.mjs --site
```

## Publish an update

1. Edit the day's `dayN/` page, data, assets and README.
2. Update its title, description, status and optional tags in `directory/days.json`.
3. Run `npm run check`. This regenerates the directory; include the updated `directory/index.html` in the commit.
4. Preview the collection and the affected day page.
5. Commit and push the reviewed changes to `main`.

```sh
git status --short
git add .
git commit -m "Describe the map update"
git push origin main
```

The local checkout's `origin` points to `https://github.com/PaulGibbs3rd/30DayMapChallenge2026.git`. On a fresh computer, clone that repository before editing.

Do not commit `_site/`, nested `dist/` folders, `node_modules/`, local `.openai/` hosting metadata, or credentials. The repository's ignore rules cover these generated and local-only paths.

## Verify publication

Open **Actions** in the GitHub repository and check both the validation run and **pages build and deployment**. Once Pages succeeds, open the directory, select a day, and verify its assets and interactions.

If the page still shows an older version, wait for the Pages deployment to finish and reload. Keep resource URLs relative so they resolve beneath `/30DayMapChallenge2026/`; a root-absolute path such as `/assets/map.png` would point to the account site's root instead.

## Settings for a fresh setup

The current configuration is already set. If the site needs to be recreated:

1. Open **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then save.
4. Wait for GitHub's branch Pages workflow to complete.

## Day 1 hosting behavior

The app uses client-side GeoJSON and does not need ArcGIS credentials or a backend. Esri's CDN, Google Fonts, Spotify and YouTube require internet access. Native music players control preview/full-song availability and regional restrictions.

The earlier owner-private Sites preview is a separate deployment. Its identity and deployment records stay local and are ignored by Git. GitHub Pages uses the public repository configuration.

[Artwork credits](../day1/research/artwork-sources.md), [data sources](../day1/research/README.md), and [repository notices](../NOTICE.md) remain with the project.

## References

- [GitHub: configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub: publishing with a branch](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-from-a-branch)

