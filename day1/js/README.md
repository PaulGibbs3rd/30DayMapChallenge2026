# Day 1 browser modules

- `app.js` loads the local venue and setlist data, initializes the ArcGIS map, synchronizes show selections and filters, renders the setlist, and places decorative artwork around venue points.
- `player.js` maps song titles to verified Spotify tracks and YouTube videos, switches native embed providers, and removes the previous player when playback is stopped or a new recording is loaded.

Spotify is the default. Native players control the available preview/full-song experience. There are mappings for 66 of the 67 distinct setlist titles; the birthday singalong has an explicit search fallback. The Spotify version of 911 is labeled as a Live in NYC recording. Embedded recordings are not audio from the selected tour concert.

No credentials, raw audio files, or music-service secrets are stored in these modules. See the [playback research](../research/music-playback.md) and [project notes](../readme.md).
