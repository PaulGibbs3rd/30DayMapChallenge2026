# Somewhere Between — Seattle's urban–rural edges

The user approved the Seattle-focused explorer after researching the national comparison option. Implemented November 9, 2026 in the existing Day 9 folder.

The user selected a two-map visual comparison. Two equal panels have independent place selectors and panning, synchronized scales, three shared map lenses, large density figures, and a ratio below. Seven researched locations remain available, with three suggested pairings. Visitors can also sample a custom point in either map, swap places, and share both centers and the common scale.

Responsive web app, static GitHub Pages delivery, public bundled data. No user identity, protected portal content, or backend is needed. Detailed source/method/validation information is in readme.md; research-seattle.md retains the source investigation.

### ArcGIS requirements handoff summary

- **Work Target:** New Seattle/King County application replacing the Day 9 placeholder.
- **Project Folder:** `day9/`, source under `day9/scripts/app`.
- **ArcGIS Product Context:** Standalone JavaScript SDK app with bundled public data and public Esri background services; no private ArcGIS Online or ArcGIS Enterprise content.
- **Target Platform:** Responsive web, existing static GitHub Pages hosting.
- **Delivery Scope:** Challenge prototype; two maps with linked scale, three shared map modes, independent selectors/panning, A/B tract comparison, sources, URL state.
- **Identity & Access Model:** Public; no sign-in or credentials required by the selected resources.
- **Core Features and Operations:** 2D data visualization, local geographic lookups, navigation, comparison, shareable state.

#### Remaining assumptions

1. The user will review the local result before any separate publication request.
2. Geometry and planning classifications are illustrative and not parcel-level determinations.

#### Next agent actions

- [ ] Address any user feedback within Day 9.
- [ ] Publish through the repository's existing workflow when requested.
