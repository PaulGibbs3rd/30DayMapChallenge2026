# GitHub Pages deployment

This repository is prepared for **PaulGibbs3rd/30DayMapChallenge2026**. GitHub Pages has not been verified as live during preparation. These are the intended URLs after the first successful deployment:

| Page | Expected URL |
| --- | --- |
| Collection entry point | https://paulgibbs3rd.github.io/30DayMapChallenge2026/ |
| Directory | https://paulgibbs3rd.github.io/30DayMapChallenge2026/directory/ |
| Day 1 map | https://paulgibbs3rd.github.io/30DayMapChallenge2026/day1/ |
| Other day pages | `https://paulgibbs3rd.github.io/30DayMapChallenge2026/dayN/` |

The repository entry point opens the directory. Day 1 is implemented; days 2–30 currently contain documented placeholder pages.

## Check and preview locally

Use Node.js 24. The site has no npm dependencies, so there is no install step.

```sh
npm run check
npm run dev
```

`npm run check` validates Day 1, builds the directory and static artifact, and checks local links. The preview prints a URL under `/30DayMapChallenge2026/`, matching GitHub's project-site subpath. Source edits appear after reloading. To rebuild without checks, use `npm run build`. To inspect the exact staged artifact:

```sh
node scripts/serve.mjs --site
```

The build regenerates the directory from `directory/days.json` and copies only web runtime files and public documentation into `_site/`. Local Sites metadata, Git metadata, node_modules, nested build output, and developer scripts are excluded. Do not commit `_site/` or `day1/dist/`.

## First push

Review the prepared files and the initial Git state before committing. The target repository was empty when preparation began. A typical first-push sequence is:

```sh
git status --short
git add .
git commit -m "Add the 2026 map challenge directory and Day 1 atlas"
git branch -M main
git remote add origin https://github.com/PaulGibbs3rd/30DayMapChallenge2026.git
git push -u origin main
```

If `origin` already exists, inspect it with `git remote -v` and use the existing matching remote. Do not add a second remote or overwrite a different destination without checking it.

## Enable GitHub Pages

After the initial push:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Check and publish GitHub Pages**. Run the workflow on `main` if the initial run happened before Pages was enabled.
4. Wait for the **Publish GitHub Pages** job to succeed, then use its deployment URL to verify the directory and Day 1 app.

The workflow builds and validates pull requests without publishing. A push to `main` or a manual run on `main` publishes the checked artifact. Branch or environment protection rules may require the repository owner to approve the deployment.

## Daily updates

1. Add the day's map and supporting files to its `dayN/` folder.
2. Record data sources, credits, instructions, and checks in that day's `readme.md`.
3. Update its title, description, status, and optional image/tags in `directory/days.json`.
4. Run the checks/build and preview the collection under the repository subpath.
5. Commit and push to `main` when the update is ready.

Keep asset and navigation paths relative to the page or module so they work beneath the project prefix. An absolute URL such as `/assets/map.png` would point to the account site root, not this repository.

## Hosting behavior and limits

GitHub Pages serves static HTML, CSS, JavaScript, local data, and media. The Day 1 app does not require a backend or ArcGIS credentials: its geographic layers are local GeoJSON. ArcGIS libraries, fonts, Spotify, and YouTube still require internet access. Spotify controls preview/full-song availability; external media restrictions remain in effect.

The earlier owner-private Sites preview is a separate deployment. Its `.openai/` identity and local deployment records are excluded from this repository's Pages artifact and should remain out of public Git commits. GitHub Pages does not inherit the private preview's access gate.

The [Day 1 notes](../day1/readme.md) document source and artwork credits. Gorillaz artwork and third-party content retain their owners' rights; the public project is unofficial and does not grant a blanket asset license.

## Official references

- [GitHub: using custom workflows with Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub: configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Official Node setup action](https://github.com/actions/setup-node)

