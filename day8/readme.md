# Day 8: UTOPIA — No Fixed Destination

**Date:** November 8, 2026  
**Status:** Complete static app with bundled audio.

An original fictional terrain atlas and a 5:22 guided journey through seven excerpts from Travis Scott’s UTOPIA. A 19-track index lets visitors explore the album’s imagined places. The closing chapter offers a personal choice of connection, freedom, recognition, or peace.

## Run locally

From the repository root:

```powershell
node day8/scripts/serve.mjs 4198
```

Open http://127.0.0.1:4198/. The seven MP3 excerpts in the audio folder are the default soundtrack. The Day 8 preview server binds only to 127.0.0.1 and does not expose the source FLAC folder or the rest of scripts/.

The regular repository preview and GitHub Pages use the same bundled MP3 files, with no local server API or file selection required. **Select files** is an optional alternative: select the seven prepared WAVs or the supplied FLAC album files. The browser decodes the seven required tracks and crops their passages into playback buffers; original FLAC duration is compared with the reference edition. Selected files remain in browser memory and are not uploaded. A file with the wrong reference duration is rejected.

To regenerate the prepared excerpts:

```powershell
python day8/scripts/prepare-audio.py '<local FLAC folder>' --analyze --render day8/audio-cues.json
```

The preparation script uses a portable FFmpeg executable from imageio-ffmpeg in its ignored tools folder. Original FLAC files are read only. The local inventory records the reference metadata and FLAC audio MD5 identifiers.

To encode the delivery soundtrack from the prepared WAVs:

```powershell
python day8/scripts/bundle-audio.py
```

The seven 192 kbps stereo MP3 excerpts total 7.75 MB. Decoded MP3 durations were verified against the cue sheet. The user explicitly requested their inclusion for the GitHub upload; the complete album is not included.

## Experience and controls

- **Enter the journey** plays all seven scheduled excerpts in sequence. The music starts only after an explicit interaction.
- Play/pause, previous/next chapter, replay, volume/mute, and the waveform seek bar control one common timeline.
- Map camera, color treatment, selected place, narrative annotation, chapter indicator, and signal-based marker emphasis follow actual audio-context time.
- Drag, scroll, map zoom buttons, arrow keys, or the track index enter free exploration and pause the journey. **Return to the journey** resumes the saved playback position.
- The full album index contains 19 spatial annotations; seven tracks have guided audio passages. The other twelve are supporting map locations, not additional soundtrack clips.
- The last chapters offer four possible places of utopia. The selected place becomes the focus during Departure.
- The About dialog offers reduced camera motion. The initial value follows the operating system preference. The page pauses playback when hidden and on audio interruption.

## Rendering and synchronization

The app uses dependency-free JavaScript modules, Canvas 2D, and Web Audio. The terrain is an original deterministic height field rendered with hillshade, synthetic contours, water, an arena plan, an observatory, a room, a river, and track beacons. These are imagined landforms: there is no real DEM, geographic coordinate system, measured elevation, or distance scale.

A custom renderer was selected for this non-geographic atlas so the camera can be reconstructed directly from soundtrack time. No ArcGIS SDK, account, API key, portal item, or protected service is used. The prior ArcGIS implementation proposal in the plan is superseded by this renderer choice.

Seven decoded audio buffers are scheduled on one AudioContext epoch. Pause stops their scheduled sources and retains the position. Resume and seeking recreate the remaining schedule. Stale completion callbacks cannot end a newly selected passage. A seek also reconstructs the map and annotations rather than firing only the next event. Camera movement and cues are deterministic, including backward seeking.

The app requests `navigator.audioSession.type = 'playback'` before creating its audio context and when starting or resuming music. This addresses the iPhone symptom of the map and timer advancing while Web Audio is silenced by the Ring/Silent setting: [WebKit explains that default Web Audio is treated as ambient audio](https://bugs.webkit.org/show_bug.cgi?id=252746). The request is feature-detected; browsers without the API retain normal Web Audio playback. On older iPhone browsers without this support, Silent Mode may still need to be turned off, or headphones used. Both `suspended` and iOS `interrupted` output states pause the journey, and playback cannot start its clock unless the context is running. No microphone access is requested.

Source intervals and 23 visual cues live in audio-cues.json. waveforms.json contains small normalized RMS envelopes derived from the local source excerpts; it contains no playable audio. The MY EYES transition near source time 2:26.50 was identified from the supplied recording’s energy rise. Exact downbeats, lyric alignment, phrase endings, and overall artistic pacing still need listening review. Device output latency has not been perceptually measured, and sample-accurate visuals are not claimed.

## Files and publication

Runtime: index.html, style.css, app.js, audio-output.js, scene.js, timeline.js, world.js, audio-cues.json, waveforms.json, and the seven audio/*.mp3 files.

Local tools, source inventory, and lossless working audio remain under scripts/.local/, ignored by scripts/.gitignore and excluded by the Pages packager. The seven delivery MP3 excerpts are deliberately included under audio/ so the static app plays after publication. GitHub Pages publishes the collection from the main branch and repository root.

Recordings and musical compositions retain their respective copyrights. This fan project makes no claim that transformation or excerpt length establishes legal clearance. See the audio folder's README and repository NOTICE for credits and the scope of the included material.

## Sources and interpretation

- [Official challenge themes](https://30daymapchallenge.com/2026/) place Utopia on November 8.
- [Sony Music release announcement](https://www.sonymusic.ca/press_release/travis-scott-releases-utopia-album) supplies the album’s 19-track sequence.
- [Travis Scott’s PIN–UP design alphabet](https://www.pinupmagazine.org/articles/travis-scott-design-alphabet) discusses architecture, landscaping, virtual worlds, and creating utopia in one’s own circumstances.
- [The lyric research and planning draft](plan.md) links each track’s research source. Annotations are original paraphrases and editorial interpretations; no full lyric text is bundled.
- Audio comes from the user’s supplied 24-bit/44.1 kHz stereo FLAC recordings. Ownership of music, artist identity, and associated rights remains with their respective owners. This is an unofficial fan project.

## Validation

Twelve focused audio/transport tests cover music-session selection before opening the output, compatibility when Audio Session is absent or inaccessible, refusal to advance on an interrupted output, contiguous audio scheduling, pause/resume, seeking, exact chapter and cue boundaries, canceled resume requests, stale completion callbacks, replay state, and deterministic camera reconstruction.

```powershell
node --test day8/scripts/timeline.test.mjs
node day8/scripts/check.mjs
npm run build
node day8/scripts/check.mjs --site
npm run check
```

The browser was exercised at desktop and phone dimensions: prepared WAV playback, direct import and decoding of the seven original FLAC recordings, bundled MP3 playback under the GitHub Pages project path, pause, seeking to the MY EYES transition, keyboard map exploration, the 19-track dialog, personal ending selection, reduced-motion selection, and natural completion. Browser diagnostics had no warnings or errors at the inspected checkpoints. Subjective listening review and device output latency remain outstanding.

The iPhone audio-session regression is covered with a simulated Silent Mode output policy, not a physical iPhone. Device confirmation remains required: open the new release in Safari, leave Silent Mode on, tap Enter, verify audible output, then pause/resume and seek. Repeat after an interruption or switching away and back, and verify the same controls with Silent Mode off and with headphones. A desktop browser at phone dimensions does not establish iOS audio compatibility.

The Day 8 integrity check validates all track/chapter mappings, 23 cues, bundled MP3s, UI IDs, local asset references, and project-subpath audio URLs. Its --site mode checks that exported runtime files match their sources and excludes FLAC/WAV masters and local tools.

The root collection check now runs the Day 8 transport and integrity checks, including verification of the exported soundtrack. Publication validation uses an isolated snapshot of the intended release files so unrelated local drafts do not enter the release or its checks.
