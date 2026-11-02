# Day 1: Points — Gorillaz / The Mountain Tour Atlas

Date: November 1, 2026  
Status: Implemented and browser-verified.

## Map idea

Follow all 23 US and Canada dates on the supplied Gorillaz **The Mountain Tour 2026** poster. Select a venue point or tour-list entry, explore the concert's ordered setlist and encore, and play a song using the embedded Spotify player. YouTube is an alternative provider.

## Run locally

From this folder, run `npm run dev` and open the printed local URL. The app is buildless HTML, CSS and JavaScript. `npm run check` validates source data and music mappings; `npm run build` copies deployable files to `dist/`.

No dependency installation, ArcGIS API key, account sign-in, geocoder, routing service, database, or server API is required. The browser loads ArcGIS Maps SDK for JavaScript **5.1**, including its compatible Calcite components, from Esri's CDN. Internet access is required for those libraries, Google Fonts, and music players.

## Data and attribution

- **Tour schedule and artwork:** user-supplied Gorillaz US/Canada tour poster, stored in `assets/tour-poster.png`. Artwork belongs to Gorillaz / respective rights holders; this is an unofficial fan project.
- **Scrapbook artwork:** user-supplied Superfast Jellyfish image plus official Gorillaz, Plastic Beach, The Now Now, Demon Days and Cracker Island covers. [Direct artwork sources](research/artwork-sources.md). Original images are composed with CSS cutout shapes, paper frames, rotation and tape. Artwork automatically moves or hides to leave venue points clear; mobile uses a smaller selection.
- **Setlists:** 23 individual [setlist.fm records](https://www.setlist.fm/setlists/gorillaz-13d681d1.html), researched November 1, 2026. [Show-by-show sources](research/README.md). Community-maintained records may change.
- **Counts:** 592 listed song entries, 67 distinct titles. Tape-only interludes and soundchecks are excluded. A New York false start and Phoenix birthday cover are retained with notes. Encore breaks appear where the source records them.
- **Venue points:** approximate venue/park centers in WGS84, stored in `data/tour.geojson`. Each feature retains a coordinate source and accuracy note; the Atlanta festival point represents Piedmont Park. [Geography notes](research/geography.md).
- **Map background:** locally packaged Natural Earth country polygons and US state boundary lines, public domain. The stylized map is intended for regional exploration.
- **Music:** [playback sources and limitations](research/music-playback.md). Spotify's native player controls the available preview/full-song experience and may require listener sign-in. YouTube may restrict individual videos or playback in the in-app browser. Song recordings are not the selected concert's live audio.

## Features

- Numbered venue points, map/list synchronization and shareable show URL hashes.
- City/venue search, US/Canada filters, previous/next concert navigation.
- Separate selected venue and optional dashed show-order line. The line is **not a travel route**.
- Ordered setlists with encore divisions, source links and performance notes.
- Provider switch, embedded track playback, external provider links, and explicit search fallback for unmapped rarities.
- Responsive phone layout with a native Calcite tour selector, keyboard-friendly list alternatives, reduced-motion support and a source/about dialog.
- Local GeoJSON for every geographic layer; no hosted feature services or ArcGIS authentication.

## Verification

Data checks assert 23 unique chronological dates and venue IDs, valid regional coordinate ranges, a matching nonempty sourced setlist for every venue, song-count consistency and music mapping coverage. JavaScript syntax checks pass.

Browser checks cover clicking a map point, filtering Oakland, filtering Canada, previous/next show navigation, the source/about dialog, provider selection and responsive layouts. Spotify preview playback was verified by starting Feel Good Inc. and observing the native Pause control. Full playback depends on the listener's Spotify account and browser; YouTube returned unavailable in the in-app browser.

## Output

- [Map page on GitHub Pages](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day1/)
- [Day 1 source folder](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day1)
- [All daily maps](../directory/index.html)
- Local map entry point: [index.html](index.html)
- The earlier private Sites preview is separate; its local hosting configuration is excluded from Git.
- Social post: not created
