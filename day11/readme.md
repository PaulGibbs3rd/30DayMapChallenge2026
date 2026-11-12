# Day 11 — Puget Sound, Below the Surface

**November 11, 2026 · Senses: Sound**

An interactive listening map of Puget Sound. Select a hydrophone on the chart or in the station list to see where it listens and open the corresponding Orcasound page. The listening guide plays narrated examples of Southern Resident orcas, a ferry, and a harbor seal from the Langley Whale Center exhibit.

## Sources

- **Station locations and directory listings** come from the public [Orcasound feed catalog](https://live.orcasound.net/api/json/feeds), checked November 11, 2026. [Port Townsend](https://live.orcasound.net/listen/port-townsend), [Bush Point](https://live.orcasound.net/listen/bush-point), and [Sunset Bay](https://live.orcasound.net/listen/sunset-bay) had public listings. Orcasound provides a [Point Robinson profile](https://live.orcasound.net/listen/point-robinson), and the catalog omits its feed from the public directory. The map labels it as a documented site. Feed availability can change.
- **Station context** comes from the [Port Townsend Marine Science Center](https://ptmsc.org/projects/orcasound-hydrophone/) and Orcasound’s profiles for [Bush Point](https://www.orcasound.net/portfolio/bush-point-hydrophone/) and [Sunset Bay](https://www.orcasound.net/portfolio/sunset-bay-hydrophone/).
- **Audio** streams from the [Langley Whale Center’s Pat Price Ocean Listening Exhibit](https://orcasound.net/ed/booth/local.html), hosted by Orcasound. The clips illustrate regional sounds and carry the exhibit’s narration.
- **Shoreline** comes from the [U.S. Census Bureau’s 2024 cartographic county boundaries at 1:500,000](https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip). Polygon rings were cropped to 123.95° W–121.22° W and 47.13° N–48.42° N, rounded to five decimal places, and packaged in [shoreline.json](shoreline.json). The chart uses a local equirectangular projection centered on Puget Sound.

## Run locally

Run `npm run dev` from the repository root and open `http://127.0.0.1:4174/30DayMapChallenge2026/day11/`. The chart uses Canvas, with HTML buttons for keyboard selection. The coastline and stations load from the project. Playback and station pages need an internet connection.

- [Project page](https://paulgibbs3rd.github.io/30DayMapChallenge2026/day11/)
- [Source folder](https://github.com/PaulGibbs3rd/30DayMapChallenge2026/tree/main/day11)
- [Official challenge theme](https://30daymapchallenge.com/2026/)
