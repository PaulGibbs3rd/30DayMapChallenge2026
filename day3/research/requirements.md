### ArcGIS requirements handoff summary

- **Work Target:** Feature addition to the existing Day 3 application.
- **Project Folder:** `day3/`, as identified by the user’s Day 3 request and repository convention.
- **ArcGIS Product Context:** ArcGIS Online (`arcgis.com`); publicly shared state and 119th Congress FeatureServer items.
- **Target Platform:** Browser, static GitHub Pages project subpath.
- **Delivery Scope:** Working educational challenge application; live polling, provenance, saved fallback and accessible results. No independent election calls or district-boundary authoring.
- **Identity & Access Model:** Public, anonymous, as documented in the existing repository’s GitHub Pages audience. No sign-in; only verified public read-only resources. No keys, secrets, editing or private portal content.
- **Core Features and Operations:** State and congressional district polygon visualization, state/district selection and zoom, House/Senate/governor switching, per-race candidate results, filters, explicit party colors, refresh and source attribution.

#### Remaining assumptions
1. The map covers the 50 US states on November 3, 2026. Territories and DC are excluded from these national feeds.
2. House view uses the user-supplied 119th Congress district layer. Its vintage is explicitly disclosed because 2026 election boundaries may differ after redistricting. All 435 voting district IDs match the feed one-to-one; DC is excluded.
3. Existing static Pages delivery is retained; no separate Sites hosting is created.

#### Next agent actions
- [x] Route to `build-with-arcgis-maps-sdk-for-javascript` and `build-with-calcite-design-system` for implementation.
- [x] Route to `follow-arcgis-authentication-patterns`; verify public item and read-only service access, omit credentials for these public-only resources.

The official `npx @arcgis/create` interactive command was run in `day3/`, with project name `starter` and template `cdn`. The generated original is retained under `starter/`; its SDK 5.1 module bootstrap and Calcite Shell / map component pattern were adapted into the main application. The official template loads SDK and Calcite from the ArcGIS CDN with no package installation or build step.
