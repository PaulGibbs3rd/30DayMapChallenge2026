# UTOPIA audiovisual storyboard

Updated November 8, 2026. The Canvas/Web Audio map app is implemented. Seven draft excerpts are bundled as MP3s at the user's explicit request for GitHub upload. Source offsets are recorded in [audio-cues.json](audio-cues.json). Phrase boundaries and musical cue alignment have not been verified by subjective listening.

## Experience contract

Audio, map, and UI must behave as one experience. The user selected actual local album recordings for the prototype and requested sourcing and excerpt preparation. A soundtrack beside an independently running map would not satisfy the requirement.

One explicit Enter with sound interaction begins the prepared experience. Keep a persistent transport with play/pause, replay chapter, chapter selection, timeline seeking, elapsed time, volume, and mute. The map remains the main surface. The current track and chapter remain legible without opening a panel.

The recommended guided edit is 4–6 minutes across six main excerpts and an epilogue. This duration is an editorial target, not a measured result or an assertion about permitted excerpt lengths. The 19-track index remains available for exploration. The sequence below is an authored interpretation, not the album's original running order.

## Sequence and choreography

| Chapter | Recording and selection brief | Map choreography | UI choreography |
| --- | --- | --- | --- |
| 1 — The Room | SIRENS: identify a suitable passage around the closing dialogue. | Begin in an intimate room; pull back to reveal its place in the fictional territory. | Title resolves, then becomes a compact chapter label; reveal the first route. |
| 2 — Perspective | MY EYES: choose a continuous excerpt spanning its musical transition. | Move from an obscured view to an exposed landscape; reveal an alternate reading of the same territory. | Change the interpretive annotation at the authored cue while the transport stays fixed. |
| 3 — Spectacle | CIRCUS MAXIMUS: select a passage supporting crowd energy and monumental scale. | Approach an arena; increase light and route density through manually timed musical cues. | Emphasize the Spectacle region and its connected tracks without blocking the map. |
| 4 — Displacement | LOST FOREVER: identify the passage with island/ocean imagery and an appropriate musical boundary. | Drift offshore into an archipelago; make the distinction between proximity and connection visible. | Replace the route annotation with a question about belonging; retain navigation and a clear return. |
| 5 — Refuge | PARASAIL: identify a continuous passage connecting landscape imagery with recovery. | Enter a shaded river valley; simplify the composition and slow the camera. | Reduce secondary detail; keep the selected track and controls easy to find. |
| 6 — Possibility | TELEKINESIS: choose a passage supporting the tension between fulfillment, ascent, and unresolved attachment. | Rise to a high overlook of the same territory; leave earlier regions visible. | Offer a choice of places representing connection, freedom, recognition, or peace. |
| Epilogue — Departure | TIL FURTHER NOTICE: select a brief closing reflection. | Open several onward paths rather than announcing a perfect destination. | Offer Explore the atlas and Replay; preserve the visitor's chosen place during this session. |

Draft source offsets and durations are now recorded in the cue sheet. The MY EYES transition cue is based on a measured RMS rise near source time 146.50 seconds, with 50 ms analysis windows. Other scene cues are editorial placeholders, not verified lyric timestamps or downbeats. All phrase boundaries and transitions need listening review. No generated imitations have been substituted for the supplied recordings.

## Audio acquisition and handling

- The user supplied a local folder with all 19 FLAC recordings on November 8, 2026. Metadata confirms 24-bit/44.1 kHz stereo and the UTOPIA album tags. Source acquisition is resolved; no purchase was made.
- The inventory, waveform analysis, seven WAV excerpts, and playable review screen are under day8/scripts/.local/. This folder is ignored by Git, and the Pages packager excludes scripts/.
- The user requested bundled delivery: seven edited MP3s under audio/ are included in the static export. The complete source album and lossless working copies remain excluded. Optional selected local files stay in browser memory.
- Record filename, track identity, edition, decoded duration, and the selected source in/out positions. Never silently substitute a clean, live, video, remastered, or alternate release.
- Preserve full source files locally. Audition short candidate passages, then represent chosen excerpts as in/out offsets. Export separate clips only if needed for performance or editing, into a private ignored working directory.
- Begin with short, clean transitions. Add fades only where the chosen recording and edit justify them. Do not time-stretch tracks to disguise synchronization failures.
- [Spotify prohibits synchronization with visual media](https://developer.spotify.com/policy), including through its [widgets](https://developer.spotify.com/documentation/embeds/terms). It is excluded as this experience's soundtrack engine.
- [YouTube's IFrame API](https://developers.google.com/youtube/iframe_api_reference) exposes time and playback state, but [YouTube policies](https://developers.google.com/youtube/terms/developer-policies) require respecting its visible player and prohibit separating audio/video. An official embed is a separate fallback design, not a way to acquire local clips.

## Shared playback clock

Use Web Audio for local decoded clips. An [AudioBufferSourceNode can start at a scheduled time with a source offset and duration](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start). Use the audio clock to schedule playback; derive visual state from that timeline. Use [output timestamps](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp) where supported to account for audio output timing. Device latency and rendering still need measurement; do not claim sample-accurate visuals.

Keep a single experience time, chapter-relative time, and source-track time, with explicit conversions between them. Every scene cue uses chapter-relative seconds. Source in/out points belong to the recording metadata and must not be confused with experience time.

The render loop evaluates the desired state at the current experience time: camera position, visible layers, selection, color treatment, annotation, active chapter, and progress. Timers must not run a separate visual show that can drift away from playback.

| Action or event | Required behavior |
| --- | --- |
| Start | Wait until the selected audio and essential scene assets are ready; begin from an explicit user interaction. |
| Pause | Preserve the exact timeline position and stop scheduled audio; freeze time-driven camera/UI changes. |
| Resume | Reschedule the remaining audio from the saved position and resume visuals from the same timeline. |
| Seek forward/backward | Stop stale sources and reconstruct the entire scene at the destination, including annotations and layer state. Do not merely trigger the next cue. |
| Change chapter | Cancel pending audio and camera work; prepare the selected chapter and rebuild its initial state. |
| Explore freely | Pause guided playback before allowing free map movement; provide an explicit Return to journey action. |
| Page hidden or audio interrupted | Pause the experience; resynchronize before a user-requested resume. |
| Missing audio or decode failure | Show which source is unavailable and offer retry/setup. Do not advance as if album audio were playing. |
| Reduced motion | Preserve the same audio, annotation timing, and selections; replace continuous camera travel and pulses with restrained changes. |

AudioBufferSourceNodes are one-shot sources: seeking/resuming recreates and reschedules them. Keep a generation identifier so late asset loads, old cues, and interrupted navigation cannot overwrite the active chapter. Load/decode only the current excerpt's source and the next necessary source within a bounded memory budget.

## Cue authoring

Each chapter needs a recording reference, verified source in/out offsets, an initial scene, timed keyframes, and an end behavior. A cue can target camera, region visibility, lighting/color, annotation, selection, or UI emphasis. Interpolate between keyframes where motion is appropriate. Maintain cue identifiers and handle repeated seeks without duplicated effects.

Author the meaningful musical moments after listening. Beat markers may support restrained pulses, but the choreography should follow phrasing and narrative as well as rhythm. Any audio analysis must use the local recording rather than extracting a protected provider stream. The initial prototype can use manually placed markers.

For ArcGIS, first test whether camera interpolation, selection, layer changes, and overlays meet the timing and performance target. Treat rendering as replaceable behind a scene interface. Do not start multiple independent goTo animations and assume their wall-clock durations stay aligned with audio after pause or seek.

## First implementation slice

Build one complete MY EYES excerpt before expanding the album journey:

1. Inspect the supplied recording and refine the draft excerpt spanning the measured musical transition by listening.
2. Prepare the two visual states and the transition between them in the same fictional place.
3. Connect local-file loading, transport, audio scheduling, timed annotations, and map rendering to the shared clock.
4. Test pause/resume, repeated seeking across the transition, replay, chapter cancellation, reduced motion, and a background-tab interruption.
5. Measure cue alignment on desktop and mobile. Aim for perceptually tight cues, with a provisional target within about 100 ms on tested devices; record actual results and device limitations.
6. Expand to the remaining chapters only after this slice behaves reliably.

All seven WAV and delivery MP3 durations were checked against the cue sheet. The HTTP app was browser-tested with playback, direct FLAC import, pause, seeking, desktop/phone layouts, map exploration, track selection, reduced motion, and natural completion. Nine audio transport/timeline tests pass. Subjective listening review and device output-latency measurement remain outstanding. The earlier standalone review.html preview was blocked by the browser's file-URL policy; this does not affect the tested HTTP app.
