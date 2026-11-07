# 30DayMapChallenge 2026

**Thirty days of maps, experiments, and geographic storytelling by Paul Gibbs.**

This collection follows the [2026 #30DayMapChallenge](https://30daymapchallenge.com/2026/), with a different theme for every day of November. Each project has its own page, source folder, and README documenting the idea, data, credits, process, and limitations. The collection is organized for browsing on GitHub Pages and for reading the implementation on GitHub.

**Day 1 is complete:** [Gorillaz — The Mountain Tour Atlas](day1/readme.md) maps 23 US and Canada concert venues, connects each show to its sourced setlist, and lets visitors play songs through Spotify or YouTube. It uses the ArcGIS Maps SDK for JavaScript, Calcite UI, local GeoJSON, and a playful collage of Gorillaz artwork. Day 2 is an interactive 3D Seattle street-grade explorer with ranked segments and terrain elevation profiles. [Day 3: Election Night Atlas](day3/readme.md) follows US House, Senate and governor contests with congressional district and state polygons and CivicAPI results. Day 4 explores Inland Empire warehouse clusters. [Day 5: Seattle Sightlines](day5/readme.md) tests views from the Space Needle in 3D. [Day 6: Neon Japan](day6/readme.md) is a 16-bit sci-fi expedition across Japan. Days 7–30 have theme descriptions and clearly labeled placeholder pages.

## Browse the collection

- [GitHub Pages collection](https://paulgibbs3rd.github.io/30DayMapChallenge2026/)
- [Directory page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/directory/)
- [Day 1: Gorillaz tour atlas](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day1/)
- [Repository](https://github.com/PaulGibbs3rd/30DayMapChallenge2026)

GitHub Pages publishes directly from the `main` branch and repository root. The root page opens the directory.

The directory includes a description, implementation status, source-folder link, hosted day-page link, and project notes for every day. Search by theme or subject, or filter the collection to completed and planned entries.

## Run and check locally

Use **Node.js 24**. No npm dependencies or installation step are required.

```sh
npm run dev
```

Open the printed URL, normally `http://127.0.0.1:4174/30DayMapChallenge2026/`. The local server uses the same repository subpath as GitHub Pages, so relative paths can be checked before publication.

```sh
npm run check
```

This validates the Day 1 data and music mappings, regenerates the directory, builds the public static artifact in `_site/`, and checks local links and packaged assets. To build without running validation, use `npm run build`. To preview the exact built artifact, run `node scripts/serve.mjs --site`.

The directory and planned pages are static HTML/CSS/JavaScript. Day 1 additionally loads ArcGIS libraries, Google Fonts, and native music embeds over the internet. Its local GeoJSON layers require no ArcGIS API key or sign-in. Spotify controls previews and full-song availability; the app does not bypass provider restrictions.

## Repository layout

| Path | Purpose |
| --- | --- |
| `index.html` | Entry point that opens the directory. |
| `directory/` | Collection page, shared styles, preview image, and daily metadata. |
| `directory/days.json` | Titles, descriptions, themes, status, and optional tags for all 30 days. |
| `directory/template.html` | Source template for the generated directory page. |
| `day1/`–`day30/` | Each day's map page, README, and supporting files. |
| `day1/data/` | Venue and background GeoJSON plus the setlist snapshot. |
| `day1/assets/` | Tour poster and original artwork used in the collage. |
| `day1/research/` | Source URLs, data interpretation, geography, and playback notes. |
| `docs/` | Deployment and project documentation. |
| `scripts/` | Dependency-free directory generation, static packaging, preview, and checks. |
| `.github/workflows/check.yml` | Validates the data, generated directory and public links. GitHub's branch-based Pages workflow handles publication. |
| `_site/` | Generated Pages artifact; ignored by Git. |

## Daily collection

Pages for planned days are placeholders until those maps are implemented. All 30 share the same repository; each **Source** link opens that day's folder.

| Day | 2026 theme | Status | Project links |
| --- | --- | --- | --- |
| 01 | Points | Complete — Gorillaz tour atlas | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day1/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day1) · [Notes](day1/readme.md) |
| 02 | Lines | Complete — Seattle, a City of Climbs | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day2/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day2) · [Notes](day2/readme.md) |
| 03 | Polygons | Complete — Election Night Atlas | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day3/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day3) · [Notes](day3/readme.md) |
| 04 | Clusters | Complete — Warehouse / Country | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day4/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day4) · [Notes](day4/readme.md) |
| 05 | Senses: Sight | Complete — Seattle Sightlines | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day5/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day5) · [Notes](day5/readme.md) |
| 06 | Vintage | Complete — Neon Japan | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day6/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day6) · [Notes](day6/readme.md) |
| 07 | 10 minute map | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day7/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day7) · [Notes](day7/readme.md) |
| 08 | Utopia | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day8/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day8) · [Notes](day8/readme.md) |
| 09 | Urban-rural | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day9/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day9) · [Notes](day9/readme.md) |
| 10 | Prompting only | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day10/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day10) · [Notes](day10/readme.md) |
| 11 | Senses: Sound | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day11/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day11) · [Notes](day11/readme.md) |
| 12 | Power | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day12/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day12) · [Notes](day12/readme.md) |
| 13 | Interactions | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day13/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day13) · [Notes](day13/readme.md) |
| 14 | Borgesian map | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day14/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day14) · [Notes](day14/readme.md) |
| 15 | Inside out | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day15/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day15) · [Notes](day15/readme.md) |
| 16 | Collaborative map | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day16/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day16) · [Notes](day16/readme.md) |
| 17 | Light & dark | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day17/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day17) · [Notes](day17/readme.md) |
| 18 | NULL | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day18/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day18) · [Notes](day18/readme.md) |
| 19 | Senses: Smell | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day19/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day19) · [Notes](day19/readme.md) |
| 20 | Hexagons | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day20/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day20) · [Notes](day20/readme.md) |
| 21 | OpenStreetMap | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day21/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day21) · [Notes](day21/readme.md) |
| 22 | Projections | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day22/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day22) · [Notes](day22/readme.md) |
| 23 | Senses: Taste | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day23/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day23) · [Notes](day23/readme.md) |
| 24 | Network | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day24/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day24) · [Notes](day24/readme.md) |
| 25 | Is this a map? | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day25/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day25) · [Notes](day25/readme.md) |
| 26 | Water | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day26/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day26) · [Notes](day26/readme.md) |
| 27 | New tool | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day27/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day27) · [Notes](day27/readme.md) |
| 28 | Senses: Feeling | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day28/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day28) · [Notes](day28/readme.md) |
| 29 | Raster | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day29/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day29) · [Notes](day29/readme.md) |
| 30 | Pen & paper | Planned | [Page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day30/) · [Source](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day30) · [Notes](day30/readme.md) |

## Add or finish a day

1. Implement the map in its existing `dayN/` folder. Keep runtime assets and shareable data beside the project, and use relative paths.
2. Update that day's `readme.md` with the subject, sources, credits, instructions, validation, and reflections.
3. Edit the matching entry in `directory/days.json`: set the title and description to the actual project, update `status` to `complete`, and add optional `tags` or a preview image.
4. Run `npm run check` to regenerate the directory and verify the public artifact. Do not edit the generated `directory/index.html` directly.
5. Preview the page and collection, then commit and publish the reviewed update.

## Publish with GitHub Pages

The repository is [PaulGibbs3rd/30DayMapChallenge2026](https://github.com/PaulGibbs3rd/30DayMapChallenge2026), using its default branch, `main`. Pages is configured as **Deploy from a branch → main → / (root)**. GitHub publishes changes pushed to that branch.

The validation workflow checks the data and links on pushes and pull requests. `.nojekyll` keeps these buildless pages and local data files static. Run `npm run check` before committing so the generated directory is current. [Deployment instructions](docs/deployment.md) cover the URLs, publishing settings and later updates.

## Data, artwork, and credits

Each day's README is the starting point for its data sources and attribution. For Day 1, see the [show-by-show setlist sources](day1/research/README.md), [geography notes](day1/research/geography.md), [music playback sources](day1/research/music-playback.md), and [artwork credits](day1/research/artwork-sources.md).

Natural Earth geography is public domain. Gorillaz imagery and music retain their respective owners' rights; this fan-made project is unofficial. Source code publication does not grant a blanket license to third-party artwork, music, or data. See [NOTICE.md](NOTICE.md).

## References

- [Official 2026 challenge themes](https://30daymapchallenge.com/2026/)
- [Previous map challenge repository](https://github.com/PaulGibbs3rd/30DayMaps)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Share finished work with `#30DayMapChallenge`.
