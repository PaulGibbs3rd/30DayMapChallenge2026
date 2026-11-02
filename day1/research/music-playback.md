# Music playback research

Checked for the Day 1 Gorillaz tour map, November 1, 2026.

## Recommended options

### Spotify embeds

Spotify supplies credential-free interactive embeds for individual tracks, albums and playlists. A track ID is required. Keep the complete iframe permissions, including `encrypted-media`. The available playback experience depends on the listener and browser; full-track playback must not be promised. Let listeners operate the native player controls. Loading a new iframe removes the old player and stops its playback.

- [Spotify embeds](https://developer.spotify.com/documentation/embeds)
- [Creating an Embed](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed)
- [Troubleshooting](https://developer.spotify.com/documentation/embeds/tutorials/troubleshooting)
- [iFrame API reference](https://developer.spotify.com/documentation/embeds/references/iframe-api)

### YouTube embeds

A standard visible YouTube player uses no application credentials. Each song needs a verified video ID, ideally the official Gorillaz upload. Videos can be unavailable for embedding or in a listener's region. Keep a normal YouTube link as a fallback. Keep the player at least 200 by 200 pixels, provide an identifying HTTP Referer (`strict-origin-when-cross-origin`), and preserve native controls and branding. If the JS API is enabled, supply the actual page origin. Playback must be initiated by the listener; autoplay can be blocked by browsers.

- [YouTube player parameters](https://developers.google.com/youtube/player_parameters)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
- [Embedded player identity requirements](https://developers.google.com/youtube/terms/required-minimum-functionality)
- [YouTube embedding help](https://support.google.com/youtube/answer/171780)

## iTunes Search API evaluated

The Search API supports JSONP callbacks for cross-origin search and returns streaming preview URLs when available. It requires no application secret. However, Apple's current terms restrict promotional previews to promoting the associated content, require a proximate approved purchase badge and attribution, and prohibit independent entertainment use. Consequently it is not the recommended playback source for an entertainment-led tour map.

- [Official current iTunes Search API and terms](https://performance-partners.apple.com/search-api)

## General implementation

- Load only after a visitor chooses a song.
- Do not download or rehost audio/video files.
- Distinguish commercial studio recordings from live concert recordings.
- Do not fabricate playback availability or claim actual audio playback based only on a successful iframe load.
- Keep external fallback links when embeds are blocked or a song has no verified embed ID.

## Implemented providers

After YouTube playback was unavailable in the visitor's browser, Spotify was added as the default provider. The visitor can switch between Spotify and YouTube. Switching providers removes the previous iframe before a new selection is loaded; two providers never play simultaneously.

### Spotify

The Spotify catalog maps 66 of 67 unique setlist titles to exact track URIs verified from the official public Spotify embed pages. Titles and the album artist were checked before matching; featured-artist suffixes, accent marks and the `New Genious`/`New Genius` spelling variation were normalized. The brief `Happy Birthday to You` concert cover has a clearly labeled Spotify search fallback. No unrelated birthday recording is substituted.

The `911` choice is Spotify's **Live in NYC** archive performance, explicitly labeled in the player, rather than the studio single or the selected 2026 concert. Other Spotify mappings are commercial album/single recordings.

Sources for the exact album track metadata:

- [Gorillaz](https://open.spotify.com/embed/album/4tUxQkrduOE8sfgwJ5BI2F)
- [Demon Days](https://open.spotify.com/embed/album/0bUTHlWbkSQysoM3VsWldT)
- [Plastic Beach](https://open.spotify.com/embed/album/2dIGnmEIy1WZIcZCFSj6i8)
- [Humanz Deluxe](https://open.spotify.com/embed/album/0NvirtaDCaZU5PAW1O5FDE)
- [The Now Now](https://open.spotify.com/embed/album/1amYhlukNF8WdaQC3gKkgL)
- [The Fall](https://open.spotify.com/embed/album/7xHfsH8Ec9Ory9v6nok3mQ)
- [Song Machine Deluxe](https://open.spotify.com/embed/album/1yCnOPMq0BVzKKn97HiIFp)
- [Cracker Island](https://open.spotify.com/embed/album/4wtZQMNTC1O79kDxMBsEan)
- [The Mountain](https://open.spotify.com/embed/album/1RvJmGd47lKS4XMXs9j8hD)
- [D-Sides](https://open.spotify.com/embed/album/0GNfoRLyw7VfXQUbM5VbG4)
- [G-Sides](https://open.spotify.com/embed/album/3wRwNXvbTBvdCDENCdrXuQ)
- [Garage Palace](https://open.spotify.com/embed/track/1Rstazzb7ttz0o7QpSPUGw)
- [911 — Live in NYC](https://open.spotify.com/embed/track/0tocP6ZmztTIDtm9IY9MA0)

Only title, artist, album and track-ID metadata are used. Spotify's native embed handles playback and any listener sign-in. A preview may be offered, and full playback is not promised. Native iframe permissions include `encrypted-media`; every track has a direct Spotify fallback link. The application stores no Spotify credentials and makes no Web API/OAuth requests. Audio preview URLs are not used outside Spotify's player.

### YouTube

The visitor selected YouTube videos. `js/player.js` maps 66 of the tour's 67 unique setlist titles: 64 to official Gorillaz or label-delivered Gorillaz - Topic uploads, plus two clearly labeled fan/archive uploads for rarities. The brief cover `Happy Birthday to You` deliberately leads to a clearly labeled YouTube search rather than an unrelated birthday recording.

Primary sources:

- [Warner's official Gorillaz video widget catalog](https://assets.wmgartistservices.com/gorillaz/YTwidget.php)
- [Official Gorillaz YouTube channel](https://www.youtube.com/@Gorillaz)
- [Gorillaz - Topic](https://www.youtube.com/channel/UCNIV5B_aJnLrKDSnW_MOmcQ)

Rarity exceptions, with uploader identified in the player:

- [`911` — Gorillaz & D12, uploaded by Gorillaz Archive](https://www.youtube.com/watch?v=EFKyGMpjFMs). The YouTube search record identifies the exact song and Terry Hall collaboration. This is a third-party archive upload, not an official channel or a recording of the 2026 Detroit concert.
- [`Dracula` — uploaded by Everything Gorillaz](https://www.youtube.com/watch?v=rOJ0__UQlLY). YouTube's own oEmbed metadata verified the title and uploader. This is explicitly labeled a fan archive upload.

Additional upload IDs were discovered through the [Gorillaz channel index on Kworb](https://kworb.net/youtube/artist/gorillaz.html), then their exact titles and uploader channels were verified through YouTube's own public oEmbed endpoint. This was metadata verification, not a guarantee of embeddability or regional playback availability. The one live upload in the catalog, `Busted and Blue` at Printworks, is explicitly identified as such. Other uploads are studio recordings, visualisers, music videos or official animatics, not recordings of the selected 2026 concert.

The YouTube player creates one visible privacy-enhanced iframe only after a song is selected. A new selection, provider change or `stopPlayback()` removes the old iframe. Native controls start playback; no audio/video is downloaded, extracted or rehosted. Every mapped track includes a direct YouTube fallback link. There is no application API secret.
