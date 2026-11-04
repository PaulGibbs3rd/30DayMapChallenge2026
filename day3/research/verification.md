# Browser verification · November 3, 2026

The local app was served at the repository’s `/30DayMapChallenge2026/day3/` subpath and inspected in the Codex in-app browser.

- All 50 state polygons loaded from the supplied public ArcGIS item and rendered in Albers equal-area projection.
- House switching displayed 435 separate contests; selecting California produced 52 district races.
- Candidate search `Raul Ruiz` found CA-25 with candidate names, party text, zero-vote totals and the verified source results route.
- The close-race filter returned an honest empty state for the provider’s zero-vote payloads.
- Governor switching displayed 36 contests. Senate displayed 35, with the Florida and Ohio special-election labels.
- California and Hawaii in the Senate view displayed no-contest-in-feed text rather than a winner or an error.
- State selectors, Alaska/Hawaii buttons and Reset synchronized panel selection and map navigation.
- Keyboard ArrowRight switched the active office, with the checked radio state exposed to assistive technology.
- About opened the methodology dialog with links, reporting definitions and House aggregation explanation.
- CivicAPI HTTP failures exercised explicitly labeled saved snapshots; subsequent successful polling restored connected status while retaining the stale source timestamp warning.
- Desktop layout checked at 1440 × 900. Mobile layout checked at 390 × 844, including scrolling to the results controls, search and refresh; the document had no horizontal overflow. Mobile office/status overlap was corrected.
- Browser console inspection found no application errors or missing-asset warnings.

The provider reported zero votes during QA. Positive vote leaders, ties, close races, calls and district party colors were verified with synthetic unit-test inputs in the excluded scripts folder; no synthetic results are displayed in the public app.

## Congressional boundary addition

- Added the user-supplied public USA 119th Congressional Districts layer. Its 436 source records include DC; the map excludes DC to match the 435 voting races.
- Verified a one-to-one join for all 435 district keys, including the six at-large `00` → `al` conversions. The attribute-only verification manifest is saved with its URL and fetch time.
- House view streams district geometry through the SDK FeatureLayer, while Senate and governor retain state polygons. The layer’s incumbent attributes never supply election colors.
- Browser-selected California returned 52 races. Selecting CA-23 returned its candidate results, zoomed and highlighted its district, and stored `district=ca-23` in the URL.
- Clicking CA-23 on the map opened its race and cleared a conflicting search. Switching to governor hid the district control and restored state mapping.
- Alaska’s at-large seat selected as `ak-al`. Mobile checks at 390 × 844 showed no horizontal overflow.
- The House map includes an always-visible 119th Congress vintage notice; its boundaries are not asserted to be identical to 2026 election geography.
- The expanded election suite contains 16 checks.

## 120th Congress replacement

Replaced the previous layer with Census TIGERweb Labels/MapServer/40 (120th Congress, January 1, 2026 vintage). Verified all 435 voting district joins using STATE/CD120 and rendering via GEOID. Excluded non-voting 98 and water-only ZZ records. The existing 16 data checks pass against the refreshed Census join manifest.
