# ArcGIS agentic developer toolkit — experience and feedback

Living field notes by Paul Gibbs, compiled from the 2026 30DayMapChallenge chats and the available GitHub Copilot hiking-app conversation. Initial review: November 2, 2026 (America/Los_Angeles). Updated November 3, 2026 to add Day 3, and November 5, 2026 to add the hiking data and MAUI planning session. A subsequent Copilot review adds Windows MAUI implementation and offline-map preparation; its session date is not established in the available record. Coverage: installation, Days 1–3, the November 5 Enterprise/ArcPy inventory and MAUI requirements handoff, and the Copilot continuation below.

This log evaluates the Esri developer skills and developer documentation MCP server within actual mapping work. It separates direct user feedback, recorded behavior, and reviewer interpretation. Successful applications demonstrate feasibility, but do not establish how much faster or more accurate the toolkit was than an unaided agent. No comparative benchmark has been run.

**November 6, 2026 update:** added Days 4 and 5 through their completed publication turns. Coverage now includes installation, Days 1–5 at their respective review snapshots, and the existing hiking/MAUI and Copilot sections. Earlier daily snapshots and unrelated feedback remain unchanged.

## Evidence and review boundaries

Historical chats reviewed, including all older pages available at their review snapshots, plus the available Copilot continuation:

| Source | Chat ID | Coverage |
| --- | --- | --- |
| Add Esri developer agent skills | `01a199ad-358e-7393-b918-abc19530f7c6` | Installation instructions, command failure and successful retry, challenge scaffold |
| Find day 1 theme and plugins | `01a199b8-f927-7021-85cb-b520ef22bc43` | Points project, design iteration, playback, deployment and demo |
| Find a Day 2 lines map idea | `01a19cd9-81fb-7de1-a938-fa4757a654d3` | Initial ideas and OSM exploration, Seattle pivot, implementation, refinement, deployment and ongoing Calcite refactor |
| Map today's state races | `01a1a269-36cb-72e2-9d06-3f1802b45b61` | All six available turns: initial build, congressional boundaries, publication, custom-domain question and two typography exchanges; reviewed November 3 |
| Build Day 4 building clusters | `01a1a943-3898-74e1-a9d3-fece374c2aba` | All 12 available turns: requirements, NYC prototype, warehouse pivot, context/rendering/performance/layout feedback and publication; reviewed November 6 |
| Build Seattle line-of-sight app | `01a1aea5-9acb-7271-92fd-363c5a87d6d2` | All three available turns: initial build and wait feedback, Mount Rainier addition and publication; reviewed November 6 |
| GitHub Copilot — HikingApp implementation and offline preparation | Not exposed in this session | Earlier work from the supplied conversation summary; directly visible continuation from offline capability inspection through export-basemap access checks |

Supporting artifacts: [Day 1 notes](../day1/readme.md), [Day 1 implementation handoff](../day1/research/implementation.md), [Day 2 notes](../day2/readme.md), and [official CLI starter preserved locally](../day2/starter/README.md). Historical test results below were reported in the source chats and project notes; this feedback review did not rerun the applications.

The Day 2 chat was active during review. Its latest Calcite refactor had no final response in the retrieved snapshot. Local Day 2 files already contained refactor changes. Treat that work as provisional until its final validation is recorded.

The Copilot review uses only history available in this conversation, not an export of all Visual Studio chat threads. Earlier authentication, UI, and build outcomes are preserved in the supplied handoff summary; later Portal inspections, user selections, and export HTTP responses are directly visible. No historical application tests were rerun for this document update. Older statements that MAUI implementation was future work remain valid for their original November 5 snapshot, not the later Copilot continuation.

Day 3 supporting artifacts: [project notes](../day3/readme.md), [requirements handoff](../day3/research/requirements.md), [verification record](../day3/research/verification.md), and [preserved starter](../day3/starter/README.md). The November 3 update adds Day 3 without re-reviewing later Day 2 work. Day 3 was idle at review; the app was published, while its typography feedback remained unimplemented.

## Installation experience — November 1, 2026

### What happened

1. Paul supplied the Esri skills repository and asked how to add its plugins.
2. The agent identified the repository as a Codex plugin marketplace and provided `codex plugin marketplace add Esri/esri-developer-agent-skills`.
3. Instructions then required restarting Codex, opening Plugins, selecting the Esri marketplace, installing `arcgis-developer-core`, and choosing relevant technology plugins. A new chat was recommended after installation.
4. Paul asked the agent to run the command. Its first attempt failed with Windows access-denied errors for Codex temporary directories and marketplace staging. It also emitted PATH-alias and stale-directory cleanup warnings.
5. The same command succeeded on retry: exit code 0, with confirmation that marketplace `esri-developer-agent-skills` had been added. The recorded installed marketplace root was under `C:\Users\slack\.codex\.tmp\marketplaces\esri-developer-agent-skills`.
6. The agent again told Paul to restart and install the core and technology plugins. Individual UI installation clicks and restart completion are not recorded in this chat. The later Day 1 chat exposes the ArcGIS JavaScript, REST JS, Calcite, and core skills and uses Esri documentation search, providing downstream evidence that the relevant capabilities became available.

### Feedback

**Positive observation:** a repository URL was enough to discover a supported installation route, and the agent could carry out marketplace registration when asked. The setup recovered from its initial permissions failure.

**Friction:** “add the marketplace” and “install the plugins” are separate steps. Restarting, selecting a core plugin, selecting technology plugins, and starting a new chat create several handoffs before the first map. The record does not show a single end-to-end installation check.

**Attribution:** the access-denied error concerns the Windows/Codex execution environment. It is not evidence of a defect in Esri's plugin package. A separate repository-fetch DNS failure also occurred during discovery; that belongs to network/tool access unless further evidence shows otherwise.

**Suggested improvement:** provide one Codex-specific onboarding checklist that distinguishes marketplace registration, plugin installation, restart/new-chat requirements, and verification. End with a small check that lists loaded skill versions and performs one documentation search. Explain the core-plus-technology dependency clearly and include a Windows permissions troubleshooting note.

**Unknowns:** exact UI install steps, time spent restarting, whether dependency selection felt obvious, and Paul's subjective installation rating. Do not infer those from command success.

## Day 1 — Points: Gorillaz / The Mountain Tour Atlas

### Task and outcome

Paul requested an ArcGIS JavaScript app with Calcite UI, tour venue points, sourced show-by-show setlists, a strong Gorillaz visual theme, and song playback. In response to the access question, he explicitly requested local client-side GeoJSON to avoid ArcGIS authentication.

The resulting project documents 23 US/Canada shows, 592 setlist entries and 67 distinct song titles. It uses ArcGIS JavaScript 5.1 components, local GeoJSON geography, map/list synchronization, search and filters, and embedded music. The agent reported 66 of 67 song titles matched for Spotify playback, with fallback behavior. Subsequent work added a whimsical collage, published the collection to GitHub Pages, and produced a square MP4 demonstration.

### Skills experience

- **Recorded use:** the agent read requirements, JavaScript SDK, Calcite, and authentication skills. A requirements handoff was saved in project research notes.
- **Useful behavior:** access requirements were clarified before implementation, and local geography avoided unnecessary ArcGIS credentials. The app's ArcGIS access model was distinguished from the private hosting access used for its earlier preview.
- **Direct user design feedback:** Paul asked for a more “maximalist and whimsical” appearance and additional Gorillaz artwork. The next iteration added collage elements while keeping venue points clear. This reflects a need for creative direction beyond technical SDK correctness.
- **Review interpretation:** the toolkit supported a substantial custom application rather than restricting the result to a generic map sample. However, implementation success cannot be attributed to skills alone; web research, Sites, GitHub, computer use, and local code tools also contributed.
- **Process question for follow-up:** no `@arcgis/create` invocation is visible in the reviewed Day 1 history. The currently installed JavaScript skill explicitly directs new applications through the official CLI. Confirm the skill revision at execution time before treating this as a historical compliance defect.

### Documentation MCP experience

Five Esri documentation search calls are visible in the reviewed Day 1 record. Topics included map setup, Calcite CDN setup, GeoJSON rendering/filtering, Calcite input events, and map view change events. All five calls are marked completed; that status alone does not establish relevance or accuracy of their results.

One early SDK query used `focus_area: javascript`; later SDK queries used `javascript-sdk`. That inconsistency is an integration issue to investigate, not proof that the early call failed. Current skill guidance specifies `javascript-sdk`.

### Friction outside the toolkit

YouTube embeds were reported unavailable by Paul, prompting a switch to Spotify and a verified preview playback check. GitHub Pages initially needed repository configuration; Paul configured deployment from `main`/root and the agent aligned the workflow. Demo recording required a second audio take after unrelated system audio was captured. These are useful experience notes, but should not be counted as Esri skills or documentation-server failures.

### Actionable feedback

Add a compact new-app completion check covering scaffold provenance, components, authentication decision, and actual Calcite coverage. Keep the requirements handoff concise enough to support momentum. Pair API guidance with browser checks for layout, selection, and custom artwork; documentation retrieval alone cannot validate the final experience.

## Day 2 — Lines: Seattle, a City of Climbs (in progress)

### Task evolution and outcome so far

The chat began with line-map ideas, explored all North American OSM rivers and PBF/Overpass approaches, then pivoted at Paul's request to Seattle Streets. Paul chose street steepness, a 3D scene, an elevation chart, and ranked steep roads. The agent identified `arcgis-elevation-profile` as a specialized SDK component suitable for the task.

The prototype uses a public Seattle street feature service, a 3D scene, a top-20 ranking, segment-length and duplicate-name filters, and a linked terrain profile. Later updates added an uphill camera, lower-A/higher-B endpoint labels and clickable numbered rank markers. The chat reports browser and repository checks passing for those stages, a LinkedIn GIF, and a GitHub push at commit `eef07db`.

### Skills experience and direct user interventions

**Requirements:** the agent asked whether to use the existing `day2` folder and whether access should be public without sign-in. Paul confirmed both. The access question established a consequential requirement; the folder question may have been avoidable given the daily project context. This is reviewer interpretation, not an explicit complaint from Paul.

**Scaffolding:** Paul explicitly reminded the agent: “be sure to use @arcgis\\create command for the start of the app.” The agent then generated the official CDN starter and preserved it in `day2/starter/`. An initial interactive CLI attempt is marked failed; the chat subsequently records successful generation. The record supports successful recovery, but does not establish why the initial invocation ended.

**Calcite coverage:** Paul later requested: “refactor to use all calcite components and make the scrollbar darkmode.” The initial app already used some Calcite components, but this request shows the desired level of coverage and dark-theme integration had not yet been delivered to his satisfaction. Local notes describe the subsequent shell/panel/control refactor and dark scrollbar styling; completion remains provisional at this snapshot.

**Review interpretation:** selecting the right skills did not consistently eliminate the need for user reminders about scaffold choice and comprehensive UI use. These are strong candidates for a final skill-driven verification pass. They should be framed as agent/workflow adherence issues until a specific instruction gap is demonstrated.

### Documentation MCP experience

Ten Esri documentation searches are visible in the first Day 2 review snapshot: eight through the elevation-profile, first implementation, and uphill-refinement stages, plus two during the ongoing Calcite refactor. Topics covered profile input/reference linkage, list selection, feature queries, CDN package compatibility, ground elevation, 3D labels, and Calcite shell/panel/tile/chip composition. All ten calls are marked completed.

The search topics align closely with the implemented features. Choosing the dedicated elevation-profile component was a useful documented design decision. The agent also distinguished SDOT's recorded grade from terrain-derived elevation, addressed very short high-grade segments with a length filter, and documented bridges and road-surface limitations. These are strengths of the overall workflow; the available record does not isolate which conclusions came from MCP results versus data inspection or agent reasoning.

### Remaining experience gaps

The agent's own site review identified that the first scene did not visually communicate steepness strongly enough, motivating the uphill camera and endpoint labels. It also suggested more chart space, search/context, terrain metrics, ranking qualifications and a guided tour. Only the approved first three visual changes are confirmed in that refinement stage; the remaining ideas are suggestions, not delivered features.

Local preview socket restrictions and failed browser connection attempts required switching to a working Chrome preview on port 4180. Record these as environment friction, separate from SDK or MCP defects.

### Actionable feedback

Make official scaffold use explicit at app creation and record the selected template automatically. Before delivery, audit which interface elements should use Calcite and verify theme propagation into native scrolling. Include a scene-specific review for camera storytelling, profile direction, marker readability, keyboard access and mobile layout.

## Day 3 — Polygons: Election night atlas

Reviewed November 3, 2026. Source: **Map today's state races**, all six available turns from `01a1a269-3aad-7090-a997-5c70a34b0102` through `01a1a337-6be5-75c0-be78-4d83ff383165`.

### Task and delivered outcome

Paul requested a map of that day's House, Senate and gubernatorial races, supplied state polygons and CivicAPI results, specified Republican red and Democratic blue, and explicitly requested `@arcgis/create` plus the JavaScript and Calcite plugins. He invited suggestions for useful interactions.

The agent generated the official CDN starter and built a public, anonymous ArcGIS JavaScript 5.1 application in `day3/`. Delivered features include office switching, state and candidate search, close/called filters, candidate vote bars, source and fetch timestamps, 60-second visible-page polling, manual refresh, Alaska/Hawaii navigation, and bookmarkable selection. The initial implementation used state polygons for every office, with House votes summarized by state and individual district contests in the results panel.

Paul then supplied congressional boundaries and requested their addition for House view. The revised app renders individual district polygons, links polygon clicks and district selection to candidate results, and retains state polygons for Senate and governor. The project records one-to-one identifier matches for all 435 voting districts, including at-large normalization and exclusion of DC. It visibly discloses that the supplied 119th Congress geography may differ from the boundaries used for the November 2026 election; an identifier match does not establish matching geography.

The agent reported successful publication and opened the [live Day 3 map](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day3/#office=house). Publication and validation are historical results from the source chat, not a fresh deployment check in this review.

### Skills experience

**Setup and context reuse worked:** the record shows reads of requirements, JavaScript, Calcite and authentication skills. The agent used the existing Day 3 folder and GitHub Pages audience without another folder/access questionnaire. It preserved the generated starter and saved a requirements handoff. This carries forward the context-reuse recommendation from Day 2. Because Paul explicitly requested the CLI in the opening prompt, this does not demonstrate that the agent would choose it without prompting. The first CLI command is marked failed and a second completed; the cause of that initial failure is not established by the retrieved record.

**Geographic granularity needed a second iteration:** using supplied states for the first version was consistent with the initial source, and state aggregation was disclosed. The later district request is an explicit feature addition, not proof that the first version violated the request. A useful future requirements question is whether each office should be mapped to its electoral unit from the start, alongside checking boundary vintage and join keys.

**Direct typography feedback exposed another Calcite consistency gap:** after publication, Paul asked “what font is being used?” and then “why not use the default calcite fonts like from the skill?” The agent identified Libre Franklin for headings and DM Sans for body and controls, acknowledged that custom typography was its own choice, and said Calcite's default would have been more consistent with the request.

The local stylesheet confirms a Google Fonts import and `--calcite-font-family: 'DM Sans', sans-serif`, with Libre Franklin headings. No subsequent font change appears in the reviewed chat, and the custom fonts remain in the local file at this review. Record this as **acknowledged, unresolved feedback**. The inspected Calcite skill promotes cohesive components and documented design tokens, but does not explicitly prohibit custom fonts or require a named default font. The concrete issue is the mismatch with Paul's design-system expectation, rather than a demonstrated violation of a specific no-custom-font instruction.

**Suggested improvement:** retain Calcite typography by default when Calcite is requested, and treat custom font overrides as a deliberate design choice grounded in the user's direction. Expand the final Calcite review beyond functioning controls to include typography, shell/panel composition, status presentation, and theme consistency. Day 2's component-coverage request and Day 3's font question suggest a recurring difference between using Calcite controls and delivering the cohesive Calcite experience Paul expects.

### Documentation MCP experience

Five Esri documentation searches are visible: four during the initial build and one during the district addition. They cover official scaffolding/components, Calcite controls, client-side FeatureLayer sources/rendering, map readiness and hit testing, and feature-query pagination/object IDs. All five are marked completed. The record supports targeted use but does not provide enough result-content evidence to score search relevance or quantify time saved.

Four searches use `focus_area: javascript-sdk`; the Calcite query uses `calcite`, while the installed Calcite skill specifies `calcite-design-system`. Its search term also mentions Vite/npm although the delivered app uses a CDN starter. These are query-scoping inconsistencies worth reviewing; completed status does not show whether the server accepted an alias or returned suitably scoped guidance. No focus-area discovery or full-page Esri fetch call is visible in the reviewed Day 3 record.

At this November 3 review, the exposed Esri tool namespace has changed to `mcp_for_esri_developer_documentation`, while the historical calls are labeled `mcp-for-esri-developers`. The current inventory still exposes only `fetch_esri_developer_focus_areas` and `search_esri_developer_docs`. The previously recorded mismatch with skill instructions for `fetch_esri_developer_docs` therefore remains observable. A namespace change alone is not evidence of a server capability improvement or regression.

### Data reliability and validation

The provider returned zero votes during development and source timestamps dated October 23. The app distinguished source update time from fetch time, labeled saved fallback payloads as not live, warned about stale data, and recovered from intermittent CivicAPI HTTP 502 responses. Calls required an explicit provider winner flag; a lead did not become a call. These are positive application behaviors documented in the chat and notes, although their origin cannot be isolated to the skills or MCP.

The initial suite reported 14 election checks; district support increased it to 16, covering joins and at-large IDs alongside zero votes, ties, other parties, close races, strict call flags, coverage and rejected payloads. Browser verification covered navigation, selection, search, filtering, keyboard office switching, mobile layout, fallback/recovery and console inspection. Real positive-vote results were unavailable during QA: those result states were checked with synthetic unit-test inputs, which were excluded from the public display. Live election-night behavior after votes arrived remains unverified in this review.

### Friction outside the Esri toolkit

Publishing waited on Git Credential Manager account selection. The connected GitHub integration denied write access, and Paul selected an account before the push and Pages deployment succeeded. This was authentication/tooling friction in publication, not an ArcGIS authentication or documentation-server failure. Local preview access also required recovery from failed requests. The custom-domain discussion provided guidance only; it did not configure a new domain.

### Day 3 follow-up

Keep the successful scaffold provenance, context reuse, boundary-vintage disclosure and source-freshness behavior. Carry forward the unresolved Calcite typography preference, canonical documentation focus areas, and missing page-fetch tool into the improvement register. A later review can check whether the font preference was applied and whether real results exercised the polling and rendering paths successfully.

## Day 4 — Clusters: Warehouse / Country

Reviewed November 6, 2026. Source: **Build Day 4 building clusters**, chat `01a1a943-3898-74e1-a9d3-fece374c2aba`, all 12 available turns from `01a1a943-3cd5-7980-9f41-972c7092e9f4` through `01a1a9ce-b3ff-7113-953b-6b202b4796c6`. Supporting artifacts: [Day 4 notes](../day4/readme.md), [research and interpretation](../day4/research-notes.md), and [development project](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/blob/main/day4/scripts/app/README.md).

### Task, evolution and outcome

Paul requested OSM building-footprint clustering, explicitly named `@arcgis/create`, JavaScript and Calcite, and asked for design questions. He chose nationwide exploration, type filters, a dark neon style, NYC as the opening, and a shareable result for LinkedIn. The agent used a public Esri-hosted OSM building service instead of preparing a nationwide extract. The official Vite scaffold, TypeScript source and export pipeline live under `day4/scripts/app`; the exported page and bundled runtime fit the existing static collection.

The first app, **Built / Together**, offered dominant-category clusters, filters, cluster summaries, bookmarks, share links and image export. Paul subsequently focused the story on Inland Empire warehouses. The final **Warehouse / Country** opens near Redlands and supports regional exploration, warehouse-only clusters, an explicit footprint mode, surrounding building context, place search, and a responsive filter panel. Publication completed at commit `c10e76f`; the chat reports validation, Pages deployment and public building/cluster loading succeeded on the custom domain.

### Direct user feedback and recovery

- **Performance and extent:** “lets stop people from zooming out too far as it starts to lag.” The agent initially imposed a level-14 floor. Paul later said “I need to zoom out further.” The final floor became level 10, with warehouse clusters available regionally and detailed surrounding geometry paused at wider scales. The first restriction improved load control but was too restrictive for the intended story.
- **Context:** “we kind of need all of the other buildings to show how warehouses encroach.” The agent researched agency and community concerns, retained surrounding footprints, and explained that the map establishes current proximity rather than historical displacement or measured pollution exposure. Unknown OSM tags remained unknown rather than being inferred to represent homes.
- **Visual correctness:** “it doesnt look right clusters and footprints are showing up.” The context layer was drawing warehouse polygons beneath warehouse circles. The correction excluded the selected category from the context layer, so Clusters and Footprints modes no longer duplicated the same buildings while other types stayed visible.
- **Layout:** “this ui is awkward.” The agent replaced floating city-button stacks with a location selector and grouped search, display mode, radius and type controls in one panel. A desktop sidebar and narrow-screen Filters drawer replaced scattered controls. Navigation, search, Escape dismissal and focus return were checked.
- **Feature purpose:** Paul asked why a Save image button existed. The agent connected it to the LinkedIn goal and explained that it downloads a branded image rather than posting. This was an inferred feature whose purpose needed explanation, not an explicit request to remove it.

### Skills and documentation MCP

The record shows requirements, JavaScript, Calcite and authentication skill reads. The initial questions were authorized by Paul and clarified scope, clustering meaning and presentation. Follow-up questioning repeated part of the geographic scope after Paul had already said anywhere in the US; carry established answers forward while clarifying the opening view separately. Public read-only service access avoided an unnecessary sign-in flow. CLI generation required a failed attempt followed by a completed attempt; the reviewed metadata does not establish the failure's cause.

Seven Esri documentation searches are visible, all marked completed. Six use `javascript-sdk` and cover polygon clustering, predominant categories, on-demand feature loading, cluster aggregation, navigation constraints and separate context layers. One uses `calcite-design-system` for slider and segmented-control behavior. These match concrete implementation needs and use the skill-specified focus areas. No full-page Esri fetch call is visible. Search completion does not establish result quality or explain how much each result contributed.

**Reviewer interpretation:** the strongest weakness was integration across requirements. Regional performance, meaningful neighborhood context and mutually exclusive display modes were solved in separate iterations, and one context change introduced duplication. A final review should exercise the full combination of type filter, context layer, mode, scale and shared URL before presenting the app as ready. Calcite components also did not automatically produce a coherent layout; the explicit layout feedback remains relevant to the earlier Calcite consistency findings.

### Validation and external friction

The first implementation passed build and data checks but explicitly lacked visual verification because Computer Use could not reliably verify the browser URL. Later turns record successful browser checks and publication. Preserve both stages: the initial validation gap was later addressed, rather than retroactively treating the first build as visually verified.

The project notes report strict TypeScript and production checks, live schema/count/filter checks, NULL/unknown classification, Alaska/Hawaii samples, disjoint context/focus rendering, level-10 navigation, desktop/narrow layouts, keyboard dismissal, and a downloaded map PNG inspected visually. SDK chunks still exceed Vite's 500 kB warning threshold; these checks do not constitute a performance benchmark across devices or all US locations.

Git Credential Manager delayed publishing until Paul completed sign-in, after which the push and deployment succeeded. Attribute this to GitHub publishing authentication, separate from Esri resource access. No LinkedIn post or engagement outcome is recorded, so the sharing features do not support a claim of increased views.

### Follow-up

Retain honest OSM classification, sourced interpretation, progressive loading and separate build/browser reporting. Review scale and filter combinations early, avoid duplicate rendering across layers, and use a compact map-focused Calcite layout before adding secondary sharing actions. Measure representative regional interaction performance if claiming responsiveness beyond the tested views.

## Day 5 — Senses: Sight: Seattle Sightlines

Reviewed November 6, 2026. Source: **Build Seattle line-of-sight app**, chat `01a1aea5-9acb-7271-92fd-363c5a87d6d2`, all three available turns from `01a1aea5-9f79-74c2-a3b0-e678056ff3b1` through `01a1af00-dd47-7661-8804-6a1dd60f8a4e`. Supporting artifacts: [Day 5 notes](../day5/readme.md) and [development project](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/blob/main/day5/scripts/app/README.md). The theme date is November 5; browser artifacts and publication continue into November 6.

### Task and delivered outcome

Paul requested line-of-sight analysis from Seattle's Space Needle to city points of interest, named `@arcgis/create`, JavaScript and Calcite, and requested a production application appearance. The agent reused the Day 5 folder and public Pages context, generated the official Vite template, and built a 3D explorer with ten city targets, landmark search, visibility filters, editable target heights, custom terrain-sampled points, camera presets and CSV export. Paul then requested Mount Rainier, which became an eleventh target with regional framing. The final chat reports successful GitHub publication, validation and Pages deployment at the custom domain.

The application uses public Seattle building and detailed tower scene layers, World Elevation and client-side LineOfSightAnalysis. The building data dates to 2015–16. The observer approximates the observation-deck rim and deck height plus eye height; targets are sampled points, not whole-landmark visibility tests. The project documents these assumptions and does not present results as current real-world visibility guarantees.

### Direct experience feedback

Paul interrupted the initial build with **“youve been thinking for a long time.”** The agent acknowledged that setup had taken too long and that there was not yet a usable preview, then reported that the starter and interface shell were built and analysis was being connected. This is direct evidence of unsatisfactory perceived wait, not a measured finding that the documentation server was slow. The record does not isolate how much delay came from skill reads, data discovery, SDK type work, implementation or other tool activity.

The eventual app received the specific feature request to add Mount Rainier, rather than a general redesign request. That is not an explicit satisfaction rating. The original request for a production appearance also does not establish production operational readiness; the reported acceptance covers the tested interactions and devices.

### Skills and documentation MCP

The record shows requirements, JavaScript, Calcite and authentication skill reads, including the package-managed SDK reference. The agent reused public hosting and folder context, inspected public resources, and exposed its requirements handoff. It reported SDK type-check fixes and missing icons during browser inspection before final delivery. Local Calcite icons and English localization assets were packaged as part of the final runtime.

Seven Esri documentation searches are visible: six in the first build and one for the Rainier addition. Six use `javascript-sdk`; one uses `calcite-design-system`. Topics include analysis/view target results, Seattle scene layers, Calcite imports/asset paths and long-distance or off-screen sightlines. The first LineOfSightAnalysis query appears twice with identical arguments. All calls are marked completed. The duplicate is an opportunity to reuse retrieved material, but the available evidence does not show why it was repeated or whether its returned results differed. No full-page Esri fetch call is visible.

**Reviewer interpretation:** the toolkit supported moving beyond rendering into interactive analysis, and browser testing demonstrated an input-sensitive result. To improve the experience, establish a small working scene and one verified sightline earlier, then add the full control set. Keep progress updates tied to concrete preview readiness. Avoid attributing the user's wait complaint to MCP latency without per-operation evidence.

### Analysis behavior and validation

Results depend on rendered scene detail and camera extent. The final model leaves unresolved/null/off-screen targets Pending, uses green/red segments for visibility and first obstruction, and documents that scene geometry and terrain determine results. Mount Rainier is roughly 96 km away and normally Pending in the city overview; selecting it frames both endpoints regionally. The reported Clear result in that tested regional view is a scene result, not a statement about weather, haze or survey-grade intervisibility.

Browser evidence included a useful behavior check: raising Pike Place's target from 2 m to 200 m changed its result from obstructed to clear. The chat and notes also report selection, search/filtering, height edits, custom creation/removal, reset, camera actions, methodology, CSV download and desktop/mobile checks. Missing icons, mobile action/height access and reset/filter synchronization were corrected. The CSV check covered all 11 tested points with statuses and model vintage. TypeScript, production export and the scoped static-reference check passed.

The first collection-wide check stopped on a pre-existing broken `MAUI_HIKING_APP_SPEC.md` link in this feedback draft, after data checks and static build. The agent reported that limitation rather than claiming a complete repository pass or editing the separate draft. At publication it checked a clean snapshot of the files being published, excluding unrelated local drafts; that snapshot passed all collection checks, with more than 20,000 local references reported. These are different validation scopes. The clean publish pass did not resolve the broken link in the local feedback draft.

### Follow-up

Retain the Pending state, observer/target assumptions, model vintage, camera dependence and input-sensitive browser verification. Reduce time to the first usable scene, cache repeated documentation retrieval where appropriate, and verify packaged component assets early. Broader performance, accessibility and current-world accuracy remain outside the reported checks. The earlier Day 3 font preference was not re-reviewed here, so this update does not close its unresolved issue.

## Cross-day findings and improvement register

| ID | Finding | Evidence / confidence | Suggested improvement | Status |
| --- | --- | --- | --- | --- |
| INST-01 | Onboarding has multiple manual handoffs | Installation instructions and successful command retry; high | Codex-specific install-and-verify checklist | Open |
| INST-02 | First marketplace registration hit access denied | Command output; high, environment attribution | Windows permissions guidance and clear recovery | Recovered locally |
| SKILL-01 | Official starter use required a Day 2 reminder | Direct user request and preserved starter; high | Scaffold checkpoint before writing the application | Used and preserved Day 3; explicitly requested in opening prompt |
| SKILL-02 | Calcite use did not initially meet desired coverage | Direct refactor request; high | UI component inventory and final theme/scrollbar review | Refactor in progress |
| SKILL-03 | Requirements/auth guidance supported anonymous access and context reuse | Days 1–3 handoffs; Day 3 reused folder/audience without another questionnaire; high for behavior | Retain concise access decision; reuse established context | Positive pattern retained Day 3 |
| SKILL-04 | Custom typography conflicted with expected Calcite defaults | Day 3 user question, agent acknowledgment and local CSS; high | Keep default typography unless user direction supports overriding it; add typography to final review | Acknowledged; custom fonts still present November 3 |
| MCP-01 | Skill refers to a page-fetch tool absent from this session's exposed Esri tools | Installed SDK skill versus current tool inventory; high for current snapshot | Align skill instructions with exposed tool names or document fallback | Open; historical availability unknown |
| MCP-02 | Documentation focus-area spelling varied across days | Day 1 `javascript`; Day 3 `calcite` instead of skill-specified `calcite-design-system`; high | Use canonical values consistently; validate or return actionable choices | Recurred Day 3; impact unmeasured |
| MCP-03 | Searches targeted concrete implementation needs | 5 Day 1, 10 Day 2, 5 Day 3, 7 Day 4 and 7 Day 5 calls at respective snapshots; high for use | Preserve API-focused search; capture relevance and fallback metrics | Positive pattern; quality unmeasured |
| MCP-04 | Enterprise item discovery became useful once the Enterprise MCP tools were available, but the first response did not recognize that availability | Tool-change notice, user's “try again,” and successful Portal search; high | Recheck the live tool inventory before saying a configured MCP is unavailable; distinguish Portal search from exhaustive inventory | Recovered after user prompt |
| MCP-05 | Enterprise search exposed only the curated MCP-tagged subset | Hiking query returned 12 items; activity/service/contact tables and slope/precipitation were absent from results | State search scope and absence carefully; use describe/search methods to validate each item and avoid claiming Portal-wide nonexistence | Caveat captured in handoff documents |
| REQ-01 | Progressive requirements intake established consequential MAUI decisions before writing a handoff | User confirmed production, Enterprise sign-in, iOS/Android, local trip data, trail-following turn-by-turn, and near-term forecast; high | Ask one consequential question at a time; stop when architecture is determined and label remaining data prerequisites | Completed; no explicit user satisfaction rating |
| DOC-01 | Updating the main specification with a separate service inventory was not the user's desired document organization | Direct instruction: “revert those changes and create a new doc”; high | Preserve the baseline spec when asked to add a distinct reference; split inventories into their own artifact | Corrected: original inventory restored, separate inventory document created |
| PUB-01 | ArcPy publishing diagnostics enabled a targeted fix, but table publishing still needs live ArcGIS Pro validation | Upload reported invalid `SHARE_PUBLIC`; corrected to `PUBLIC`. Three standalone tables still raised `MappingTableObject` errors; mock checks only | Keep stage-specific errors; verify actual ArcPy APIs and table references in Pro before declaring publishing resolved | Feature upload fix unverified live; table issue open |
| UX-01 | Working SDK features still needed visual and design iteration | Gorillaz collage request; Seattle camera and Calcite requests; high | Add rendered product review alongside technical checks | Ongoing |
| UX-02 | Context, display modes and zoom limits needed coordinated validation | Day 4 lag report, duplicate footprints/circles, restrictive zoom cap and awkward UI feedback; high | Check the filter/context/mode/scale combinations and compact control layout together | Corrected in reviewed Day 4 views; broader performance unmeasured |
| UX-03 | Time to a usable preview felt too long | Day 5 direct wait complaint and agent acknowledgment; high for experience, cause unmeasured | Deliver one working scene/analysis path early; report concrete preview readiness | App delivered; workflow improvement remains open |
| MCP-06 | Identical analysis search was repeated | Day 5 duplicate query arguments; high for occurrence | Reuse results before repeating; capture the reason when a retry is needed | Impact and reason unmeasured |
| QA-01 | Build, browser and publishing checks had different scopes | Day 4 initial browser block later recovered; Day 5 local draft-link failure versus clean publishing pass; high | State exactly what each pass covers and preserve unresolved draft issues | Day 4 visual gap recovered; local feedback links still need reconciliation |
| DATA-02 | Scene visibility changes with camera and loaded geometry | Day 5 Pending states, regional Rainier framing and target-height behavior check; high | Keep unresolved states and model/detail limitations explicit; test scene transitions | Implemented in tested views; real-world accuracy not established |
| DATA-01 | Live-data readiness required freshness, fallback and geography checks | Day 3 stale zero-vote feeds, observed outage/recovery and boundary-vintage disclosure; high | Retain source/fetch distinction and join checks; verify real-result updates when available | Implemented; real positive-vote browser path unverified at review |
| COP-01 | SDK-version and Windows OAuth assumptions caused repeated failed implementations | Supplied Copilot summary: obsolete APIs, unsupported Windows WebAuthenticator, and unsuccessful broker flow | Read installed SDK/platform guidance before editing; use a verified platform sample and test the actual login | Windows browser login user-confirmed; mobile and embedded-login acceptance incomplete |
| COP-02 | Successful builds did not establish startup or authentication success | Summarized runtime failures, including `StaticResource not found for key Gray200` after a successful build | Separate compilation, startup, sign-in, and feature acceptance; check resource-safe DI construction | Startup fixed and user-confirmed |
| COP-03 | Layer controls needed a compact, map-first design | Summarized direct requests for reorderable visibility controls and a small panel | Preserve the SDK collection/render order; default secondary panels to collapsed | Implemented; individual reorder/identify acceptance not established |
| COP-04 | Actual web-map references differed from the offline-ready service inventory | Direct Portal inspection: six MapServer layers; later six FeatureServer layers added alongside originals | Inspect map data and services, then verify replacement rather than addition; check popups and basemap separately | Latest inspected map retained 12 operational layers; cleanup pending |
| COP-05 | Public item metadata did not imply anonymous export access | Direct HTTP checks: item `access: public`, export operation `499 Token Required` | Explain item sharing versus operation authorization; verify credentials accepted by the export endpoint | Export access unresolved; no export implementation delivered |
| COP-06 | Tool capabilities and response continuity limited execution | Direct inventory has inspection but no Portal item-update tool; empty final replies appear between some actions | State read/write boundaries before promising changes; close each action with outcome and next step | Manual map editing required; interaction improvement open |
| COP-07 | Specification snapshot contained an incorrect recreation-subsites item ID | Direct item lookup failed; curated search found `157a50a351d4479885d11f8e1d1fd8bf` | Validate copied identifiers against live items and reconcile reference documents | Correct ID found; specification reconciliation not shown |

## Hiking data and MAUI requirements session — November 5, 2026

### Task and outcome

The session continued the ArcPy workflow for publishing the nine hiking
datasets, used the newly exposed ArcGIS Enterprise MCP to inspect Portal
content, and produced a requirements handoff for a future .NET MAUI hiking
application.

The Enterprise Portal search for “Hiking” returned 12 MCP-visible items:
11 services and one Web Map. The results included six Feature Services,
five paired Map Services, and the private `hiking map` Web Map. The MCP
identified each result's access as private. A service-detail inspection
confirmed that the Federal Lands Feature Service has `Query,Sync` and
`syncEnabled=true`. The Portal search did not return standalone USFS
Activities, Services, or Contacts tables, nor slope or precipitation items.
These are absences from a curated MCP-visible result set, not proof that the
items do not exist elsewhere in Enterprise.

The MAUI handoff records the decisions Paul provided: production quality,
iOS and Android, ArcGIS Enterprise 12.1, Enterprise user sign-in, offline
maps, trail-following routing and directions, route progress, GPS tracking,
local-only route/track/waypoint storage, slope, near-term precipitation, and
optional 3D. It identifies missing data and offline-network prerequisites
instead of assuming the current service inventory already supports every
feature. The inventory was ultimately moved to a separate document after
Paul explicitly asked to revert edits to the specification and create a new
document.

### Skills and documentation MCP

- **Requirements and authentication:** the requirements skill was used to
  gather audience, platform, delivery scope, route behavior, and local-versus-
  synced trip data. The authentication skill was used to frame protected
  Enterprise content around OAuth user sign-in and not changing item sharing
  as a workaround.
- **.NET documentation:** Esri Developer MCP searches covered MAUI OAuth,
  offline map workflows, device location, scene/elevation, and routing. A
  route query surfaced the SDK's offline-routing sample under WPF; the
  handoff correctly treats this as evidence of shared SDK concepts, not proof
  of MAUI-specific UI/API compatibility. Implementation must verify target
  framework and SDK version.
- **Enterprise MCP:** once invoked, Portal search and item description
  provided actual item IDs, access states, service capabilities, and map
  extent details. This materially improved the data section of the handoff
  over assumptions based only on the earlier publication report.
- **ArcPy publication:** the user's report showed ArcGIS Pro rejecting
  `SHARE_PUBLIC` with a valid-values message (`PUBLIC | PRIVATE`). The script
  was updated to use `PUBLIC`. Standalone tables continued to fail while
  being added to temporary maps. Their path handling was adjusted to use the
  SDE dataset path, but only mocked checks and editor diagnostics passed;
  there was no live ArcGIS Pro confirmation that table publication works.

### Friction and direct user corrections

**Enterprise MCP availability:** the assistant initially said the Enterprise
MCP was unavailable. After the runtime announced the new tools, Paul had to
say “try again”; the search then succeeded. This is direct evidence of a
tool-awareness miss, not a Portal or MCP service failure. Before claiming a
configured integration is unavailable, inspect the currently exposed tools.

**Document separation:** after requesting inventory information in the MAUI
spec, Paul asked to revert those changes and create a new document. The
assistant restored the previous inventory wording and created
`ENTERPRISE_HIKING_SERVICES.md`. Preserve the original specification when a
separate reference artifact is requested.

**No explicit evaluation:** Paul did not rate the quality of the MCP results,
requirements interview, or resulting specification. The repeat prompt and
document correction are actionable interaction signals, but should not be
expanded into broader dissatisfaction claims.

### Validation and limitations

- The Portal inventory is MCP-scoped and may omit untagged items.
- Public sharing was not inferred from tags containing the word `public`;
  item access remained private in search results.
- The main MAUI specification and the separate Enterprise inventory were
  checked as documents after editing.
- Mock ArcPy checks verified the `PUBLIC` option and intended table-path
  handling only. Actual publishing, offline map generation, OAuth, routing,
  and mobile background tracking remain untested.
- The production MAUI work is a future project, not code delivered in this
  ArcPy workspace.

### Follow-up

Keep the confirmation of private item access, explicit MCP search-scope
caveat, and data readiness blockers in future handoffs. Recheck Enterprise
tool availability dynamically; preserve user-requested document boundaries;
and validate ArcPy publication fixes in Pro before calling them complete.

### Documentation server contract observation

At the November 2 review, the installed JavaScript skill said to use `fetch_esri_developer_docs` with a `page_url` to retrieve full Markdown. That session exposed only `fetch_esri_developer_focus_areas` and `search_esri_developer_docs` from the Esri server. The former returns focus areas; it is not a page-content fetch substitute. No call to `fetch_esri_developer_docs` appeared in the reviewed daily records. The November 3 Day 3 review found the same exposed tool pair under a renamed namespace, so the mismatch remains open.

This is a concrete current mismatch between instructions and exposed capabilities. It does not prove the server lacks that capability everywhere or establish whether search results were insufficient. Clarify whether the fetch tool was renamed, omitted from this integration, or removed, and give the agent an explicit fallback for reading linked official pages.

## GitHub Copilot — HikingApp implementation and offline preparation

Session date and chat ID are not exposed. Environment: Visual Studio Professional 2026 (18.8.1), .NET 10 MAUI, C# 14, and ArcGIS Maps SDK for .NET 300.0.0. This review concerns the existing HikingApp workspace, not the earlier ArcPy-only workspace. Evidence is split between the supplied chronological summary and directly visible continuation; no exhaustive Copilot history retrieval is claimed.

### Task and recorded outcome

The summarized work installed/discovered Esri skills and MCP configuration, revised the hiking specification, implemented Enterprise OAuth and private map display, and added identify, hierarchical layer visibility, drag/drop ordering, embedded Windows login with browser fallback, and a compact layout. Windows system-browser login and post-fix startup/map display were user-confirmed. The summary reports successful builds and no discovered tests; this document review did not rerun them.

The directly visible continuation selected offline map-area download and management, inspected the real private web map and corresponding Feature Services, and investigated an export basemap. It did not implement offline jobs, progress, cancellation, area storage, reopening, or deletion. Selecting a workflow or promising configuration is not evidence that code was changed.

Source-chat artifact references (outside this repository): `MAUI_HIKING_APP_SPEC.md`, `MapViewModel.cs`, `MainPage.xaml`, `Services/Maps/ArcGisMapService.cs`, `App.xaml.cs`, and `Platforms/Windows/WindowsOAuthDialog.cs`. These identify implementation anchors, not independently retested results.

### Direct feedback and confirmations

- **Authentication correction, summarized history:** Paul said “it never prompts for a login which it should” and repeatedly directed the agent to the official Esri MAUI OAuth tutorial. This is specific feedback about a missing working sign-in experience, not an overall toolkit rating.
- **Layer behavior, summarized history:** “Also for the layer visibility lets make it a layer list with visibility as an option and allow for reorganizing the layers so they render in the order of the list.” The implementation reverses each owning SDK layer collection for display because its last layer renders on top, and restricts moves to siblings.
- **Layout, summarized history:** “The layer list should only take up a small portion of the screen. the map should be larger.” The subsequent design collapses secondary panels rather than permanently reserving map space.
- **Runtime confirmation:** the summary preserves “good that worked” for browser OAuth/map display. The visible “okay that works onto the next feature” and screenshot support the post-startup-fix map result; they do not individually certify embedded login, identify, or reorder behavior.
- **Offline direction, visible continuation:** Paul chose offline downloads first, then chose to update the Enterprise web map with verified Feature Services and requested a fresh inspection after editing it.
- **Basemap direction, visible continuation:** Paul supplied export-basemap group `c61ab1493fff4b84b53705184876c9b0`, chose a single topographic default, and responded “these layers are shared publicly” to the authentication question. Public sharing was verified, but export authorization was a separate endpoint check.

### Skills, documentation, and platform recovery

The summary records that official .NET/authentication skills and the MAUI tutorial were consulted during the successful OAuth correction. Earlier attempts used obsolete or invented OAuth types, a MAUI authentication API unsupported on Windows, and an unsuccessful Windows broker. WinUIEx 2.8.0 introduced a build-tools import problem; the tutorial's verified 2.6.0 version supported the browser flow. These are agent API/platform-selection and dependency-validation issues unless further evidence identifies a defect in the skills or SDK.

An embedded Windows WebView2 dialog was later implemented with explicit system-browser fallback, while mobile retained system authentication. Its individual runtime acceptance remains unrecorded. The resource startup failure (`StaticResource not found for key Gray200`) was traced to eager DI construction of MainPage before application resource initialization. Deferring shell resolution until window creation fixed startup. A generated debugger break location was not the source file to repair.

In the visible offline continuation, the agent read the requirements, .NET, and authentication skills and searched official .NET offline documentation. The documentation explained on-demand versus preplanned workflows and the need for sync-enabled Feature Services or export-enabled tile services. The installed .NET skill still names a full-page fetch tool absent from the exposed documentation tools, extending MCP-01's contract observation to this integration. Search completion alone does not measure documentation quality or time saved.

### Live offline capability evidence

The first live description of web map `939715d6d9f6439ab17fd05073a6f82c` showed six dynamic MapServer layers, despite the specification listing paired Feature Services. The inspected Federal Lands and USFS Trails MapServers had `singleFusedMapCache=false` and `exportTilesAllowed=false`. All six corresponding Feature Services were subsequently inspected and reported private access, `syncEnabled=true`, and `Query,Sync,ChangeTracking`. These establish service-level prerequisites, not successful download jobs or every user's permissions.

The recreation-subsites lookup initially failed because the supplied snapshot used an incorrect ID. Curated Portal search recovered the correct item, `157a50a351d4479885d11f8e1d1fd8bf`, and its service definition was inspected. A failed lookup did not establish that the dataset was absent.

After Paul's map edits, a fresh description showed all six FeatureServer layers **and** all six original MapServer layers: 12 operational layers with duplicated datasets. The retained new entries did not contain the originals' custom popup definitions in the saved map JSON; this does not prove that no service-default popup could appear at runtime. The agent requested removal of the MapServer duplicates and review of retained styling/popups. No later clean-map inspection is available.

The Portal tools exposed search and description but no item-update operation. The agent appropriately did not claim to have saved a Portal change, but the user had already selected the update workflow before that limitation was explained. An earlier capability check would reduce this handoff. Private sharing was preserved; metadata tags containing `public` were not treated as access grants.

### Export-basemap evidence and unresolved access

Public ArcGIS Online REST inspection of the supplied group found **World Topographic Map (for Export)**, item `df541726b3df4c0caf99255bb1be4c86`, using `World_Basemap_Export_v2/VectorTileServer`. Its service metadata reported `exportTilesAllowed=true` and `maxExportTilesCount=10000`. The item terms identify account/access requirements and warn against using the export layer for live web-map tiles; export enablement is not unrestricted-use permission.

A separate check confirmed item `access: public`. An unauthenticated request to `VectorTileServer/exportTiles?f=json` returned error **499, Token Required**. That response demonstrates an authorization barrier, not a valid export job or successful tile download. Enterprise credentials cannot be assumed to authorize this ArcGIS Online operation. No accepted export credential, packaged default configuration, or completed export is shown.

**Positive observation:** live capability and operation checks corrected assumptions about both map readiness and public export access. **Reviewer interpretation:** questions about credentials would be clearer after briefly explaining the verified sharing/operation distinction. An API key was offered only subject to service-support verification; the review does not establish that it is accepted here. No secret should be requested in chat, hardcoded, or reproduced in this log.

### Interaction and validation improvements

Several empty final replies appear in the visible continuation, and some result summaries were followed by further actions despite being sent as final messages. These are observable response-continuity issues, not evidence of an MCP service defect. Each action should end with a concise account of what changed, what did not, and the next blocker; promises to configure a default must be reconciled with the actual edits.

Keep compilation, user-confirmed runtime success, live service metadata, and untested workflows separate. Remaining acceptance includes mobile OAuth/map access, denied-user paths, embedded-login fallback, identify/reorder behavior, real offline generation and cancellation, network-disabled reopening, deletion without trip loss, basemap authorization/terms, and production SDK licensing. Routing, slope, forecasts, and background tracking remain separate prerequisites, not capabilities established by sync-enabled trail layers.

For the next iteration: reconcile the corrected item ID in the specification; inspect the cleaned map; establish accepted export authentication without weakening private sharing; implement bounded on-demand downloads only after readiness checks; and report build, automated tests, and device/offline acceptance independently. No quantitative toolkit rating, time-saving claim, or comparative benchmark is supported by this record.

## Continuing this log

Use this chat as the running review location. Append each day's review when requested, and update Day 2 after the active refactor completes. No recurring schedule has been requested or configured.

For every day, capture:

1. Date, theme, chat title/ID, reviewed turn range, and whether work is complete.
2. Intended outcome and actual artifact, with links to local notes and source.
3. Skills invoked/read and any user reminders or corrections.
4. MCP tools and query topics, observed errors, result usefulness when visible, and fallback sources.
5. What worked, friction, recovery, and attribution: skill, MCP, agent behavior, application/data, or host environment.
6. Validation evidence, unresolved limitations and exact direct user feedback where useful.
7. New feedback IDs, changes to existing issues, and concrete improvements to test next time.

Do not convert successful tool status into a relevance rating, estimate time saved without a baseline, or label suggestions as user complaints. Keep direct user sentiment separate from retrospective analysis. Record later corrections as dated updates so the final compiled report preserves how the experience changed.
