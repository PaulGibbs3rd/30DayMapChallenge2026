# UTOPIA soundtrack excerpts

Seven edited excerpts are included for the user's requested audiovisual map project. They are 192 kbps stereo MP3s at 44.1 kHz, totaling 7,749,842 bytes (7.75 MB) and 5:22.4 of audio.

The original recordings and compositions retain their respective owners' copyrights. Inclusion here does not grant a general license to reuse or redistribute the music. The project is an unofficial interpretation, not an endorsed release. No determination of fair use or other legal clearance is asserted by the preparation tools.

The user supplied the source FLACs and explicitly requested inclusion of these excerpts in the GitHub upload. The full album and lossless working copies are not bundled. Source intervals and scene cues are recorded in the parent folder's audio-cues.json.

Rebuild the delivery MP3s after preparing the local WAV excerpts:

```powershell
python day8/scripts/bundle-audio.py
```

The script verifies that every MP3 decodes to its intended clip duration. The app schedules the decoded excerpts with its shared audio/map/UI timeline.
