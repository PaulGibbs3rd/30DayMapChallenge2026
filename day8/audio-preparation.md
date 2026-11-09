# UTOPIA — local audio preparation

Prepared November 8, 2026 from the user's supplied FLAC folder. The source recordings were not changed.

## Inspected source

- 19 tracks, matching the planned album sequence.
- Stereo, 24-bit, 44,100 Hz FLAC throughout.
- Total duration: 73:36.803.
- FLAC tags identify UTOPIA and the track titles. Source filenames retain the user's spelling, including I KNOW _.flac; the display title remains I KNOW ?.
- Original duration, sample count, selected metadata, and the embedded FLAC audio MD5 identifier are recorded in the ignored local inventory.

## Draft excerpts

These are first-pass edit candidates, not a finished soundtrack. Source intervals and output lengths were checked programmatically. Phrase boundaries, spoken passages, musical downbeats, and artistic transitions still require listening review.

| Chapter | Track | Source interval | Clip length |
| --- | --- | --- | --- |
| The Room | SIRENS | 2:50.000–3:24.400 | 34.4 s |
| Perspective | MY EYES | 2:06.000–3:00.000 | 54 s |
| Spectacle | CIRCUS MAXIMUS | 0:00.000–0:43.000 | 43 s |
| Displacement | LOST FOREVER | 0:00.000–0:43.000 | 43 s |
| Refuge | PARASAIL | 1:25.000–2:16.000 | 51 s |
| Possibility | TELEKINESIS | 0:00.000–1:05.000 | 65 s |
| Departure | TIL FURTHER NOTICE | 0:00.000–0:32.000 | 32 s |

Total excerpt duration: **5:22.4**, before any eventual overlap between chapters. Review copies are stereo 16-bit/44.1 kHz PCM WAV, with short 25 ms entry and 80 ms exit fades. The 24-bit FLAC originals remain the reference masters.

At the user's explicit request for GitHub upload, seven 192 kbps MP3 delivery copies are now included under audio/. Their total size is 7.75 MB; all decoded MP3 durations match the cue sheet. The app uses these excerpts by default. Full source FLACs and lossless working WAVs remain excluded from the public export.

MY EYES has a strong local energy rise near **2:26.50** in the supplied recording. In the 54-second review clip this is **0:20.50**. It was identified from 50 ms RMS windows by comparing the adjacent one-second windows within source interval 2:23–2:30. It is a candidate visual transition, not a claim of audited downbeat or lyric precision.

## Review locally

Open day8/scripts/.local/review.html on the local computer. It contains seven playable excerpts, waveforms, source and clip clocks, and buttons to seek to proposed scene cues. Selecting another chapter stops the previous clip. Cue descriptions and the waveform cursor follow the audio element's actual playback time.

The local file preview was blocked by the browser tool's URL policy. Browser interaction, playback, and responsive layout have therefore not been verified. No alternate browser access was attempted.

## Reproduce

The preparation script uses Python's standard library and a portable FFmpeg executable. The FFmpeg binary was obtained from the imageio-ffmpeg 0.8.1 wheel on PyPI and extracted only into the ignored local tools folder; no global software installation was performed.

```powershell
python day8/scripts/prepare-audio.py '<local FLAC folder>' --analyze --render day8/audio-cues.json
```

Keep the generated clips, source-folder setting, tools, and review screen under scripts/.local/. Git ignores that directory, and the repository's Pages packager excludes scripts/. The shareable cue sheet stores track numbers and offsets, not album audio or full lyric transcriptions.

## Remaining work

1. Audition and refine all seven source intervals and scene cues.
2. Build the MY EYES map/audio/UI slice using a single playback clock.
3. Verify pause/resume, repeated seeking, replay, interruptions, reduced motion, and measured cue alignment.
4. Extend the verified playback behavior to the full guided sequence.
